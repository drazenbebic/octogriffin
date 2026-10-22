import { TaskDirection } from '@/enums/habitica';

import { deliverRewards } from './deliverRewards';
import type {
  InstallationStatus,
  LinkedUser,
  RecipientRewards,
  RewardableEvent,
  RewardDirectory,
  RewardLog,
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

const INSTALLATION_ID = 100;
const REPOSITORY_ID = 200;

const makeTrigger = (overrides: Partial<TriggerRule> = {}): TriggerRule => ({
  event: 'push',
  isActive: true,
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
  installationId: INSTALLATION_ID,
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
  };

  return { log, recorded };
};

describe('deliverRewards', () => {
  it('rewards a commit author once per commit', async () => {
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();

    await deliverRewards(
      makeEvent({ contributions: [{ actor: { login: 'octocat' }, count: 3 }] }),
      { directory: inMemoryDirectory([makeUser()]), log, sink },
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
      { directory: inMemoryDirectory([makeUser()]), log, sink },
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
        { directory: inMemoryDirectory([makeUser()]), log, sink },
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
      { directory: inMemoryDirectory([user]), log, sink },
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
      directory: inMemoryDirectory([makeUser()], status),
      log,
      sink,
    });

    expect(applied).toHaveLength(0);
  });

  it('only rewards the owner of the installation', async () => {
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();
    const stranger = makeUser({ installationId: 999 });

    await deliverRewards(makeEvent(), {
      directory: inMemoryDirectory([stranger]),
      log,
      sink,
    });

    expect(applied).toHaveLength(0);
  });

  it('skips users without matching triggers', async () => {
    const { applied, sink } = recordingSink();
    const { log } = recordingLog();

    await deliverRewards(makeEvent(), {
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
      { directory: inMemoryDirectory([user]), log, sink },
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
      directory: inMemoryDirectory([makeUser()]),
      log,
      sink,
    });

    expect(recorded).toHaveLength(0);
  });

  it('rewards a delivery only once, even when it arrives again', async () => {
    const { applied, sink } = recordingSink();
    const { log, recorded } = recordingLog();
    const deps = { directory: inMemoryDirectory([makeUser()]), log, sink };

    await deliverRewards(makeEvent(), deps);
    await deliverRewards(makeEvent(), deps);

    expect(applied).toHaveLength(1);
    expect(recorded).toHaveLength(1);
  });
});
