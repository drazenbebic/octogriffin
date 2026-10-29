import { TaskDirection } from '@/enums/habitica';

import { deliverRewards } from './deliverRewards';
import { RewardDeliveryError } from './RewardDeliveryError';
import {
  failingSink,
  inMemoryCaps,
  inMemoryCooldowns,
  inMemoryDirectory,
  INSTALLATION_ID,
  makeEvent,
  makeTrigger,
  makeUser,
  noCaps,
  noCooldowns,
  noDays,
  recordingLog,
  recordingSink,
  settableDays,
} from './testFakes';
import type {
  Contribution,
  LinkedUser,
  RecipientRewards,
  RewardableEvent,
  RewardSink,
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

describe('deliverRewards', () => {
  it('rewards a commit author once per commit', async () => {
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();

    await deliverRewards(
      makeEvent({
        contributions: [
          { actor: { login: 'octocat' }, count: 3, spamCount: 0 },
        ],
      }),
      {
        caps: noCaps,
        cooldowns: noCooldowns,
        days: noDays,
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
        contributions: [
          { actor: { login: 'octocat' }, count: 250, spamCount: 0 },
        ],
      }),
      {
        caps: noCaps,
        cooldowns: noCooldowns,
        days: noDays,
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
          contributions: [
            { actor: { login: 'octocat' }, count: 5, spamCount: 0 },
          ],
        }),
        {
          caps: noCaps,
          cooldowns: noCooldowns,
          days: noDays,
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
        contributions: [{ actor: { githubId: 42 }, count: 1, spamCount: 0 }],
        name: 'pull_request.closed',
      }),
      {
        caps: noCaps,
        cooldowns: noCooldowns,
        days: noDays,
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
      caps: noCaps,
      cooldowns: noCooldowns,
      days: noDays,
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
      caps: noCaps,
      cooldowns: noCooldowns,
      days: noDays,
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
      caps: noCaps,
      cooldowns: noCooldowns,
      days: noDays,
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
      caps: noCaps,
      cooldowns: noCooldowns,
      days: noDays,
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
      caps: noCaps,
      cooldowns: noCooldowns,
      days: noDays,
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
      caps: noCaps,
      cooldowns: noCooldowns,
      days: noDays,
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
        contributions: [{ actor: { githubId: 42 }, count: 1, spamCount: 0 }],
        name: 'pull_request.closed',
      }),
      {
        caps: noCaps,
        cooldowns: noCooldowns,
        days: noDays,
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
      caps: noCaps,
      cooldowns: noCooldowns,
      days: noDays,
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
      caps: noCaps,
      cooldowns: noCooldowns,
      days: noDays,
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
        caps: noCaps,
        cooldowns: noCooldowns,
        days: noDays,
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
        caps: noCaps,
        cooldowns: noCooldowns,
        days: noDays,
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
        caps: noCaps,
        cooldowns: noCooldowns,
        days: noDays,
        directory,
        log,
        sink: failingSink(),
      }),
    ).rejects.toThrow();
    await deliverRewards(makeEvent(), {
      caps: noCaps,
      cooldowns: noCooldowns,
      days: noDays,
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
      contributions: [{ actor: { login: 'octocat' }, count, spamCount: 0 }],
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
        caps: noCaps,
        cooldowns: noCooldowns,
        days: noDays,
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
        caps: noCaps,
        cooldowns,
        days: noDays,
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
        caps: noCaps,
        cooldowns,
        days: noDays,
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
      caps: noCaps,
      cooldowns,
      days: noDays,
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
      caps: noCaps,
      cooldowns,
      days: noDays,
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
      caps: noCaps,
      cooldowns: { claim: async () => false, release: async () => {} },
      days: noDays,
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
      caps: noCaps,
      cooldowns,
      days: noDays,
      directory: inMemoryDirectory(users),
      log,
      now: () => at(0),
      sink: { apply: async () => ({ 'trigger-2': 1 }) },
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
        caps: noCaps,
        cooldowns,
        days: noDays,
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
        caps: noCaps,
        cooldowns: {
          ...cooldowns,
          claim: async (uuid, previousScoredAt, now) => {
            if (uuid === 'trigger-2') {
              throw new Error('Database is down');
            }

            return cooldowns.claim(uuid, previousScoredAt, now);
          },
        },
        days: noDays,
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
        caps: noCaps,
        cooldowns: {
          ...cooldowns,
          release: async () => {
            throw new Error('Database is down');
          },
        },
        days: noDays,
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

describe('deliverRewards with daily caps', () => {
  const at = (minutes: number) => new Date(Date.UTC(2026, 9, 24, 10, minutes));
  const push = (id: string, count: number) =>
    makeEvent({
      contributions: [{ actor: { login: 'octocat' }, count, spamCount: 0 }],
      delivery: { hookId: 'hook-1', id, signature: 'sha256=abc' },
    });

  const setUp = (triggers: TriggerRule[]) => {
    const users = [makeUser({ triggers })];
    const recording = recordingSink();
    const logs = recordingLog();
    const { cooldowns } = inMemoryCooldowns(users);
    const capStore = inMemoryCaps(users);
    const dayStore = settableDays('2026-10-24');
    let deliveries = 0;

    const pushAt = (minute: number, commits: number, sink?: RewardSink) =>
      deliverRewards(push(`delivery-${deliveries++}`, commits), {
        caps: capStore.caps,
        cooldowns,
        days: dayStore.days,
        directory: inMemoryDirectory(users),
        log: logs.log,
        now: () => at(minute),
        sink: sink ?? recording.sink,
      });

    return { ...recording, ...logs, capStore, dayStore, pushAt };
  };

  const timesApplied = (applied: RecipientRewards[]) =>
    applied.map(({ rewards }) => rewards.map(({ times }) => times));

  it('stops a trigger at its daily cap', async () => {
    const { applied, pushAt } = setUp([makeTrigger({ dailyCap: 10 })]);

    await pushAt(0, 7);
    await pushAt(1, 5);
    await pushAt(2, 4);

    expect(timesApplied(applied)).toEqual([[7], [3]]);
  });

  it('starts again on a new Habitica day', async () => {
    const { applied, dayStore, pushAt } = setUp([makeTrigger({ dailyCap: 2 })]);

    await pushAt(0, 2);
    await pushAt(1, 2);
    dayStore.state.day = '2026-10-25';
    await pushAt(2, 2);

    expect(timesApplied(applied)).toEqual([[2], [2]]);
  });

  it('gives back cap slots that were not scored', async () => {
    const { capStore, pushAt } = setUp([makeTrigger({ dailyCap: 10 })]);

    await pushAt(0, 7, { apply: async () => ({ 'trigger-1': 3 }) });

    expect(capStore.released).toEqual([{ count: 4, uuid: 'trigger-1' }]);
  });

  it("doesn't start a cooldown when the cap is reached", async () => {
    const trigger = makeTrigger({ cooldownSeconds: 600, dailyCap: 1 });
    const { applied, pushAt } = setUp([trigger]);

    await pushAt(0, 1);
    await pushAt(20, 1);

    expect(applied).toHaveLength(1);
    expect(trigger.lastScoredAt).toEqual(at(0));
  });

  it('looks up the Habitica day once per recipient', async () => {
    const { dayStore, pushAt } = setUp([
      makeTrigger({ dailyCap: 5 }),
      makeTrigger({ dailyCap: 5, uuid: 'trigger-2' }),
    ]);

    await pushAt(0, 1);

    expect(dayStore.state.lookups).toBe(1);
  });

  it('never looks up the day for triggers without a cap', async () => {
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();

    await deliverRewards(push('delivery-1', 1), {
      caps: noCaps,
      cooldowns: noCooldowns,
      days: noDays,
      directory: inMemoryDirectory([makeUser()]),
      log,
      now: () => at(0),
      sink,
    });

    expect(applied).toHaveLength(1);
  });

  it('gives everything back when the Habitica day cannot be looked up', async () => {
    const trigger = makeTrigger({ cooldownSeconds: 600, dailyCap: 5 });
    const users = [makeUser({ triggers: [trigger] })];
    const { log, recorded } = recordingLog();
    const { cooldowns } = inMemoryCooldowns(users);

    await expect(
      deliverRewards(push('delivery-1', 1), {
        caps: noCaps,
        cooldowns,
        days: {
          today: async () => {
            throw new Error('Habitica is down');
          },
        },
        directory: inMemoryDirectory(users),
        log,
        now: () => at(0),
        sink: recordingSink().sink,
      }),
    ).rejects.toThrow('Some rewards could not be delivered.');

    expect(trigger.lastScoredAt).toBeNull();
    expect(recorded).toHaveLength(0);
  });

  it('gives everything back when a cap cannot be claimed', async () => {
    const users = [
      makeUser({
        triggers: [
          makeTrigger({ dailyCap: 5 }),
          makeTrigger({ dailyCap: 5, uuid: 'trigger-2' }),
        ],
      }),
    ];
    const { applied, sink } = recordingSink();
    const { log, recorded } = recordingLog();
    const { caps, released } = inMemoryCaps(users);

    await expect(
      deliverRewards(push('delivery-1', 1), {
        caps: {
          ...caps,
          claim: async (uuid, day, wanted) => {
            if (uuid === 'trigger-2') {
              throw new Error('Database is down');
            }

            return caps.claim(uuid, day, wanted);
          },
        },
        cooldowns: noCooldowns,
        days: settableDays('2026-10-24').days,
        directory: inMemoryDirectory(users),
        log,
        now: () => at(0),
        sink,
      }),
    ).rejects.toThrow('Some rewards could not be delivered.');

    expect(applied).toHaveLength(0);
    expect(released).toEqual([{ count: 1, uuid: 'trigger-1' }]);
    expect(recorded).toHaveLength(0);
  });

  it("doesn't retry when the Habitica day can never be looked up", async () => {
    const trigger = makeTrigger({ cooldownSeconds: 600, dailyCap: 5 });
    const users = [makeUser({ triggers: [trigger] })];
    const { log, recorded } = recordingLog();
    const { cooldowns } = inMemoryCooldowns(users);

    await expect(
      deliverRewards(push('delivery-1', 1), {
        caps: noCaps,
        cooldowns,
        days: {
          today: async () => {
            throw new RewardDeliveryError([new Error('Unauthorized')], false);
          },
        },
        directory: inMemoryDirectory(users),
        log,
        now: () => at(0),
        sink: recordingSink().sink,
      }),
    ).resolves.toBeUndefined();

    expect(trigger.lastScoredAt).toBeNull();
    expect(recorded).toHaveLength(0);
  });
});

describe('deliverRewards with spam', () => {
  const pushBy = (...contributions: Contribution[]) =>
    makeEvent({ contributions });
  const deliver = (event: RewardableEvent, users: LinkedUser[]) => {
    const { applied, sink } = recordingSink();
    const { log, recorded } = recordingLog();

    return deliverRewards(event, {
      caps: noCaps,
      cooldowns: noCooldowns,
      days: noDays,
      directory: inMemoryDirectory(users),
      log,
      sink,
    }).then(() => ({ applied, recorded }));
  };
  const octocat = (count: number, spamCount: number): Contribution => ({
    actor: { login: 'octocat' },
    count,
    spamCount,
  });

  it('leaves empty commits out', async () => {
    const { applied } = await deliver(pushBy(octocat(5, 2)), [makeUser()]);

    expect(applied[0].rewards[0].times).toBe(3);
  });

  it('counts empty commits with the switch off', async () => {
    const { applied } = await deliver(pushBy(octocat(5, 2)), [
      makeUser({ triggers: [makeTrigger({ skipSpam: false })] }),
    ]);

    expect(applied[0].rewards[0].times).toBe(5);
  });

  it('leaves spam out before the per-event limit', async () => {
    const { applied } = await deliver(pushBy(octocat(12, 4)), [makeUser()]);

    expect(applied[0].rewards[0].times).toBe(8);
  });

  it('scores nothing for a push of only empty commits', async () => {
    const { applied, recorded } = await deliver(pushBy(octocat(2, 2)), [
      makeUser({
        triggers: [makeTrigger({ cooldownSeconds: 600, dailyCap: 5 })],
      }),
    ]);

    expect(applied).toHaveLength(0);
    expect(recorded).toHaveLength(0);
  });

  it('counts each trigger with its own switch', async () => {
    const { applied } = await deliver(pushBy(octocat(4, 1)), [
      makeUser({
        triggers: [
          makeTrigger(),
          makeTrigger({ skipSpam: false, uuid: 'trigger-2' }),
        ],
      }),
    ]);

    expect(
      applied[0].rewards.map(({ times, triggerUuid }) => [triggerUuid, times]),
    ).toEqual([
      ['trigger-1', 3],
      ['trigger-2', 4],
    ]);
  });

  it('rewards a user with real commits next to one with only empty ones', async () => {
    const { applied } = await deliver(
      pushBy(octocat(2, 2), {
        actor: { login: 'hubot' },
        count: 2,
        spamCount: 0,
      }),
      [makeUser(), makeUser({ githubId: 43, id: BigInt(2), login: 'hubot' })],
    );

    expect(
      applied.map(({ recipient, rewards }) => [
        recipient.login,
        rewards[0].times,
      ]),
    ).toEqual([['hubot', 2]]);
  });
});

describe('deliverRewards with bots', () => {
  // Bots can't sign in with GitHub, so they're never linked users
  it('rewards nobody for an event a bot caused', async () => {
    const { applied, sink } = recordingSink();
    const { log, recorded } = recordingLog();

    await deliverRewards(
      makeEvent({
        contributions: [
          { actor: { githubId: 49_699_333 }, count: 1, spamCount: 0 },
        ],
        name: 'pull_request.opened',
      }),
      {
        caps: noCaps,
        cooldowns: noCooldowns,
        days: noDays,
        directory: inMemoryDirectory([
          makeUser({
            triggers: [makeTrigger({ event: 'pull_request.opened' })],
          }),
        ]),
        log,
        sink,
      },
    );

    expect(applied).toHaveLength(0);
    expect(recorded).toHaveLength(0);
  });
});
