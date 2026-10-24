import { TaskDirection } from '@/enums/habitica';

import { deliverRewards } from './deliverRewards';
import { RewardDeliveryError } from './RewardDeliveryError';
import type {
  InstallationStatus,
  LinkedUser,
  RecipientRewards,
  RewardableEvent,
  RewardDirectory,
  RewardLog,
  RewardSink,
  TriggerCooldowns,
  TriggerRule,
} from './types';

jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

const INSTALLATION_ID = 100;
const REPOSITORY_ID = 200;

const makeTrigger = (overrides: Partial<TriggerRule> = {}): TriggerRule => ({
  cooldownSeconds: null,
  event: 'push',
  isActive: true,
  lastScoredAt: null,
  repositoryIds: [REPOSITORY_ID],
  scoreDirection: 'up',
  taskAlias: null,
  taskAttribute: 'str',
  taskFrequency: 'daily',
  taskNote: null,
  taskPriority: 1,
  taskTitle: 'Write code',
  uuid: 'trigger-1',
  ...overrides,
});

const makeUser = (overrides: Partial<LinkedUser> = {}): LinkedUser => ({
  credentials: { apiToken: 'habitica-token', userId: 'habitica-user' },
  githubId: 42,
  id: BigInt(1),
  installationIds: [INSTALLATION_ID],
  login: 'octocat',
  triggers: [makeTrigger()],
  ...overrides,
});

const makeEvent = (
  overrides: Partial<RewardableEvent> = {},
): RewardableEvent => ({
  contributions: [{ actor: { login: 'octocat' }, count: 1 }],
  delivery: { hookId: 'hook-1', id: 'delivery-1', signature: 'sha256=abc' },
  installationId: INSTALLATION_ID,
  name: 'push',
  repositoryId: REPOSITORY_ID,
  ...overrides,
});

const inMemoryDirectory = (
  users: LinkedUser[],
  status: InstallationStatus | null = {
    isRepositorySelected: true,
    isSuspended: false,
  },
): RewardDirectory => ({
  findLinkedUsers: async actors =>
    users.filter(user =>
      actors.some(actor =>
        'githubId' in actor
          ? actor.githubId === user.githubId
          : actor.login === user.login,
      ),
    ),
  getInstallationStatus: async () => status,
});

const recordingSink = () => {
  const applied: RecipientRewards[] = [];
  const sink: RewardSink = {
    apply: async recipientRewards => {
      applied.push(recipientRewards);

      return recipientRewards.rewards.map(({ triggerUuid }) => triggerUuid);
    },
  };

  return { applied, sink };
};

const recordingLog = () => {
  const recorded: { delivery: string; event: string; login: string }[] = [];
  const log: RewardLog = {
    claim: async (event, recipient) => {
      const isClaimed = recorded.some(
        entry =>
          entry.delivery === event.delivery.id &&
          entry.login === recipient.login,
      );

      if (isClaimed) {
        return false;
      }

      recorded.push({
        delivery: event.delivery.id,
        event: event.name,
        login: recipient.login,
      });

      return true;
    },
    release: async (event, recipient) => {
      const index = recorded.findIndex(
        entry =>
          entry.delivery === event.delivery.id &&
          entry.login === recipient.login,
      );

      recorded.splice(index, 1);
    },
  };

  return { log, recorded };
};

const failingSink = (isRetryable = true): RewardSink => ({
  apply: async () => {
    throw new RewardDeliveryError([new Error('Habitica said no')], isRetryable);
  },
});

// Triggers without a cooldown never claim one
const noCooldowns: TriggerCooldowns = {
  claim: async () => {
    throw new Error('Only triggers with a cooldown are claimed.');
  },
  release: async () => {
    throw new Error('Only triggers with a cooldown are released.');
  },
};

/** Compare-and-sets `lastScoredAt` on the users' own trigger objects. */
const inMemoryCooldowns = (users: LinkedUser[]) => {
  const released: string[] = [];
  const findTrigger = (uuid: string) =>
    users.flatMap(({ triggers }) => triggers).find(t => t.uuid === uuid);

  const cooldowns: TriggerCooldowns = {
    claim: async (uuid, previousScoredAt, now) => {
      const trigger = findTrigger(uuid);

      if (
        !trigger ||
        trigger.lastScoredAt?.getTime() !== previousScoredAt?.getTime()
      ) {
        return false;
      }

      trigger.lastScoredAt = now;

      return true;
    },
    release: async (uuid, claimedAt, previousScoredAt) => {
      released.push(uuid);

      const trigger = findTrigger(uuid);

      if (trigger?.lastScoredAt?.getTime() === claimedAt.getTime()) {
        trigger.lastScoredAt = previousScoredAt;
      }
    },
  };

  return { cooldowns, released };
};

describe('deliverRewards', () => {
  it('rewards a commit author once per commit', async () => {
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();

    await deliverRewards(
      makeEvent({ contributions: [{ actor: { login: 'octocat' }, count: 3 }] }),
      {
        cooldowns: noCooldowns,
        directory: inMemoryDirectory([makeUser()]),
        log,
        sink,
      },
    );

    expect(applied).toHaveLength(1);
    expect(applied[0].recipient.login).toBe('octocat');
    expect(applied[0].rewards).toEqual([
      {
        direction: TaskDirection.UP,
        task: {
          alias: undefined,
          attribute: 'str',
          frequency: 'daily',
          note: undefined,
          priority: 1,
          title: 'Write code',
        },
        times: 3,
        triggerUuid: 'trigger-1',
      },
    ]);
  });

  it('caps how often one event can score a trigger', async () => {
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();

    await deliverRewards(
      makeEvent({
        contributions: [{ actor: { login: 'octocat' }, count: 250 }],
      }),
      {
        cooldowns: noCooldowns,
        directory: inMemoryDirectory([makeUser()]),
        log,
        sink,
      },
    );

    expect(applied[0].rewards[0].times).toBe(10);
  });

  it('lets the instance change the cap', async () => {
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();

    process.env.MAX_REWARDS_PER_EVENT = '3';

    try {
      await deliverRewards(
        makeEvent({
          contributions: [{ actor: { login: 'octocat' }, count: 5 }],
        }),
        {
          cooldowns: noCooldowns,
          directory: inMemoryDirectory([makeUser()]),
          log,
          sink,
        },
      );
    } finally {
      delete process.env.MAX_REWARDS_PER_EVENT;
    }

    expect(applied[0].rewards[0].times).toBe(3);
  });

  it('matches event senders by GitHub ID', async () => {
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();
    const user = makeUser({
      triggers: [
        makeTrigger({ event: 'pull_request.closed', scoreDirection: 'down' }),
      ],
    });

    await deliverRewards(
      makeEvent({
        contributions: [{ actor: { githubId: 42 }, count: 1 }],
        name: 'pull_request.closed',
      }),
      {
        cooldowns: noCooldowns,
        directory: inMemoryDirectory([user]),
        log,
        sink,
      },
    );

    expect(applied[0].rewards[0]).toMatchObject({
      direction: TaskDirection.DOWN,
      times: 1,
    });
  });

  it('only uses active triggers for the same event', async () => {
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();
    const user = makeUser({
      triggers: [
        makeTrigger({ uuid: 'active' }),
        makeTrigger({ isActive: false, uuid: 'inactive' }),
        makeTrigger({ event: 'star.created', uuid: 'other-event' }),
      ],
    });

    await deliverRewards(makeEvent(), {
      cooldowns: noCooldowns,
      directory: inMemoryDirectory([user]),
      log,
      sink,
    });

    expect(applied[0].rewards.map(reward => reward.triggerUuid)).toEqual([
      'active',
    ]);
  });

  it('only uses triggers set up for the repository', async () => {
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();
    const user = makeUser({
      triggers: [
        makeTrigger({ uuid: 'this-repo' }),
        makeTrigger({ repositoryIds: [999], uuid: 'other-repo' }),
      ],
    });

    await deliverRewards(makeEvent(), {
      cooldowns: noCooldowns,
      directory: inMemoryDirectory([user]),
      log,
      sink,
    });

    expect(applied[0].rewards.map(reward => reward.triggerUuid)).toEqual([
      'this-repo',
    ]);
  });

  it.each([
    ['the installation is unknown', null],
    [
      'the installation is suspended',
      { isRepositorySelected: true, isSuspended: true },
    ],
    [
      'the repository is not selected',
      { isRepositorySelected: false, isSuspended: false },
    ],
  ])('rewards nobody when %s', async (_, status) => {
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();

    await deliverRewards(makeEvent(), {
      cooldowns: noCooldowns,
      directory: inMemoryDirectory([makeUser()], status),
      log,
      sink,
    });

    expect(applied).toHaveLength(0);
  });

  it('only rewards the owner of the installation', async () => {
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();
    const stranger = makeUser({ installationIds: [999] });

    await deliverRewards(makeEvent(), {
      cooldowns: noCooldowns,
      directory: inMemoryDirectory([stranger]),
      log,
      sink,
    });

    expect(applied).toHaveLength(0);
  });

  it('rewards the owner of any of their installations', async () => {
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();
    const owner = makeUser({ installationIds: [999, INSTALLATION_ID] });

    await deliverRewards(makeEvent(), {
      cooldowns: noCooldowns,
      directory: inMemoryDirectory([owner]),
      log,
      sink,
    });

    expect(applied).toHaveLength(1);
  });

  it('skips users without matching triggers', async () => {
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();

    await deliverRewards(makeEvent(), {
      cooldowns: noCooldowns,
      directory: inMemoryDirectory([makeUser({ triggers: [] })]),
      log,
      sink,
    });

    expect(applied).toHaveLength(0);
  });

  it('records rewarded events under their full name', async () => {
    const { sink } = recordingSink();
    const { log, recorded } = recordingLog();
    const user = makeUser({
      triggers: [makeTrigger({ event: 'pull_request.closed' })],
    });

    await deliverRewards(
      makeEvent({
        contributions: [{ actor: { githubId: 42 }, count: 1 }],
        name: 'pull_request.closed',
      }),
      {
        cooldowns: noCooldowns,
        directory: inMemoryDirectory([user]),
        log,
        sink,
      },
    );

    expect(recorded).toEqual([
      {
        delivery: 'delivery-1',
        event: 'pull_request.closed',
        login: 'octocat',
      },
    ]);
  });

  it('records nothing when nobody is rewarded', async () => {
    const { sink } = recordingSink();
    const { log, recorded } = recordingLog();

    await deliverRewards(makeEvent({ name: 'star.created' }), {
      cooldowns: noCooldowns,
      directory: inMemoryDirectory([makeUser()]),
      log,
      sink,
    });

    expect(recorded).toHaveLength(0);
  });

  it('rewards a delivery only once, even when it arrives again', async () => {
    const { applied, sink } = recordingSink();
    const { log, recorded } = recordingLog();
    const deps = {
      cooldowns: noCooldowns,
      directory: inMemoryDirectory([makeUser()]),
      log,
      sink,
    };

    await deliverRewards(makeEvent(), deps);
    await deliverRewards(makeEvent(), deps);

    expect(applied).toHaveLength(1);
    expect(recorded).toHaveLength(1);
  });

  it('fails the delivery and forgets it when nothing could be scored', async () => {
    const { log, recorded } = recordingLog();

    await expect(
      deliverRewards(makeEvent(), {
        cooldowns: noCooldowns,
        directory: inMemoryDirectory([makeUser()]),
        log,
        sink: failingSink(),
      }),
    ).rejects.toThrow('Some rewards could not be delivered.');

    expect(recorded).toHaveLength(0);
  });

  it('does not retry when trying again would not help', async () => {
    const { log, recorded } = recordingLog();

    await expect(
      deliverRewards(makeEvent(), {
        cooldowns: noCooldowns,
        directory: inMemoryDirectory([makeUser()]),
        log,
        sink: failingSink(false),
      }),
    ).resolves.toBeUndefined();

    expect(recorded).toHaveLength(0);
  });

  it('rewards a failed delivery when it is tried again', async () => {
    const { applied, sink } = recordingSink();
    const { log, recorded } = recordingLog();
    const directory = inMemoryDirectory([makeUser()]);

    await expect(
      deliverRewards(makeEvent(), {
        cooldowns: noCooldowns,
        directory,
        log,
        sink: failingSink(),
      }),
    ).rejects.toThrow();
    await deliverRewards(makeEvent(), {
      cooldowns: noCooldowns,
      directory,
      log,
      sink,
    });

    expect(applied).toHaveLength(1);
    expect(recorded).toHaveLength(1);
  });
});

describe('deliverRewards with cooldowns', () => {
  const at = (minutes: number) => new Date(Date.UTC(2026, 9, 24, 10, minutes));
  const push = (id: string, count: number) =>
    makeEvent({
      contributions: [{ actor: { login: 'octocat' }, count }],
      delivery: { hookId: 'hook-1', id, signature: 'sha256=abc' },
    });

  it('scores triggers without a cooldown every time', async () => {
    const trigger = makeTrigger();
    const users = [makeUser({ triggers: [trigger] })];
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();
    const directory = inMemoryDirectory(users);

    for (const [minute, id] of [
      [0, 'delivery-1'],
      [1, 'delivery-2'],
    ] as const) {
      await deliverRewards(push(id, 1), {
        cooldowns: noCooldowns,
        directory,
        log,
        now: () => at(minute),
        sink,
      });
    }

    expect(applied).toHaveLength(2);
    expect(trigger.lastScoredAt).toBeNull();
  });

  it('rests a trigger for its cooldown after it scores', async () => {
    const trigger = makeTrigger({ cooldownSeconds: 600 });
    const users = [makeUser({ triggers: [trigger] })];
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();
    const { cooldowns } = inMemoryCooldowns(users);
    const directory = inMemoryDirectory(users);
    const pushAt = (minute: number, commits: number) =>
      deliverRewards(push(`delivery-${minute}`, commits), {
        cooldowns,
        directory,
        log,
        now: () => at(minute),
        sink,
      });

    // In time order, one push at a time
    await pushAt(0, 7);
    await pushAt(3, 7);
    await pushAt(6, 8);

    expect(applied.map(({ rewards }) => rewards[0].times)).toEqual([7]);
    expect(trigger.lastScoredAt).toEqual(at(0));

    await pushAt(10, 20);

    expect(applied.map(({ rewards }) => rewards[0].times)).toEqual([7, 10]);
    expect(trigger.lastScoredAt).toEqual(at(10));
  });

  it("doesn't move the cooldown for skipped events", async () => {
    const trigger = makeTrigger({ cooldownSeconds: 600 });
    const users = [makeUser({ triggers: [trigger] })];
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();
    const { cooldowns } = inMemoryCooldowns(users);
    const directory = inMemoryDirectory(users);

    for (const minute of [0, 9]) {
      await deliverRewards(push(`delivery-${minute}`, 1), {
        cooldowns,
        directory,
        log,
        now: () => at(minute),
        sink,
      });
    }

    expect(applied).toHaveLength(1);
    expect(trigger.lastScoredAt).toEqual(at(0));
  });

  it('scores a trigger with a cooldown for the first time', async () => {
    const trigger = makeTrigger({ cooldownSeconds: 600 });
    const users = [makeUser({ triggers: [trigger] })];
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();
    const { cooldowns } = inMemoryCooldowns(users);

    await deliverRewards(push('delivery-1', 1), {
      cooldowns,
      directory: inMemoryDirectory(users),
      log,
      now: () => at(0),
      sink,
    });

    expect(applied[0].rewards[0].cooldown).toEqual({ previousScoredAt: null });
    expect(trigger.lastScoredAt).toEqual(at(0));
  });

  it('only skips the trigger that is cooling down', async () => {
    const users = [
      makeUser({
        triggers: [
          makeTrigger({ cooldownSeconds: 600, lastScoredAt: at(0) }),
          makeTrigger({ uuid: 'trigger-2' }),
        ],
      }),
    ];
    const { applied, sink } = recordingSink();
    const { log, recorded } = recordingLog();
    const { cooldowns } = inMemoryCooldowns(users);

    await deliverRewards(push('delivery-1', 1), {
      cooldowns,
      directory: inMemoryDirectory(users),
      log,
      now: () => at(5),
      sink,
    });

    expect(applied[0].rewards.map(({ triggerUuid }) => triggerUuid)).toEqual([
      'trigger-2',
    ]);
    expect(recorded).toHaveLength(1);
  });

  it('drops a reward another delivery claimed first', async () => {
    const users = [
      makeUser({ triggers: [makeTrigger({ cooldownSeconds: 600 })] }),
    ];
    const { applied, sink } = recordingSink();
    const { log, recorded } = recordingLog();

    await deliverRewards(push('delivery-1', 1), {
      cooldowns: { claim: async () => false, release: async () => {} },
      directory: inMemoryDirectory(users),
      log,
      now: () => at(0),
      sink,
    });

    expect(applied).toHaveLength(0);
    expect(recorded).toHaveLength(0);
  });

  it('gives the cooldown back when the trigger scored nothing', async () => {
    const first = makeTrigger({ cooldownSeconds: 600 });
    const second = makeTrigger({ cooldownSeconds: 600, uuid: 'trigger-2' });
    const users = [makeUser({ triggers: [first, second] })];
    const { log, recorded } = recordingLog();
    const { cooldowns, released } = inMemoryCooldowns(users);

    await deliverRewards(push('delivery-1', 1), {
      cooldowns,
      directory: inMemoryDirectory(users),
      log,
      now: () => at(0),
      sink: { apply: async () => ['trigger-2'] },
    });

    expect(released).toEqual(['trigger-1']);
    expect(first.lastScoredAt).toBeNull();
    expect(second.lastScoredAt).toEqual(at(0));
    expect(recorded).toHaveLength(1);
  });

  it('gives every cooldown back when nothing could be scored', async () => {
    const trigger = makeTrigger({ cooldownSeconds: 600 });
    const users = [makeUser({ triggers: [trigger] })];
    const { log, recorded } = recordingLog();
    const { cooldowns } = inMemoryCooldowns(users);

    await expect(
      deliverRewards(push('delivery-1', 1), {
        cooldowns,
        directory: inMemoryDirectory(users),
        log,
        now: () => at(0),
        sink: failingSink(),
      }),
    ).rejects.toThrow('Some rewards could not be delivered.');

    expect(trigger.lastScoredAt).toBeNull();
    expect(recorded).toHaveLength(0);
  });

  it('gives everything back when a cooldown cannot be claimed', async () => {
    const first = makeTrigger({ cooldownSeconds: 600 });
    const second = makeTrigger({ cooldownSeconds: 600, uuid: 'trigger-2' });
    const users = [makeUser({ triggers: [first, second] })];
    const { applied, sink } = recordingSink();
    const { log, recorded } = recordingLog();
    const { cooldowns } = inMemoryCooldowns(users);

    await expect(
      deliverRewards(push('delivery-1', 1), {
        cooldowns: {
          ...cooldowns,
          claim: async (uuid, previousScoredAt, now) => {
            if (uuid === 'trigger-2') {
              throw new Error('Database is down');
            }

            return cooldowns.claim(uuid, previousScoredAt, now);
          },
        },
        directory: inMemoryDirectory(users),
        log,
        now: () => at(0),
        sink,
      }),
    ).rejects.toThrow('Some rewards could not be delivered.');

    expect(applied).toHaveLength(0);
    expect(first.lastScoredAt).toBeNull();
    expect(recorded).toHaveLength(0);
  });

  it('forgets the delivery even when a cooldown cannot be given back', async () => {
    const users = [
      makeUser({ triggers: [makeTrigger({ cooldownSeconds: 600 })] }),
    ];
    const { log, recorded } = recordingLog();
    const { cooldowns } = inMemoryCooldowns(users);

    await expect(
      deliverRewards(push('delivery-1', 1), {
        cooldowns: {
          ...cooldowns,
          release: async () => {
            throw new Error('Database is down');
          },
        },
        directory: inMemoryDirectory(users),
        log,
        now: () => at(0),
        sink: failingSink(),
      }),
    ).rejects.toMatchObject({
      errors: [expect.any(RewardDeliveryError)],
    });

    expect(recorded).toHaveLength(0);
  });
});
