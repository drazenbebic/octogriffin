import { TaskDirection } from '@/enums/habitica';

import { deliverRewards } from './deliverRewards';
import {
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
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

const INSTALLATION_ID = 100;
const REPOSITORY_ID = 200;

const makeTrigger = (overrides: Partial<TriggerRule> = {}): TriggerRule => ({
  uuid: 'trigger-1',
  event: 'push',
  isActive: true,
  repositoryIds: [REPOSITORY_ID],
  taskTitle: 'Write code',
  taskAlias: null,
  taskNote: null,
  taskPriority: 1,
  taskAttribute: 'str',
  taskFrequency: 'daily',
  scoreDirection: 'up',
  ...overrides,
});

const makeUser = (overrides: Partial<LinkedUser> = {}): LinkedUser => ({
  id: BigInt(1),
  githubId: 42,
  login: 'octocat',
  installationId: INSTALLATION_ID,
  credentials: { userId: 'habitica-user', apiToken: 'habitica-token' },
  triggers: [makeTrigger()],
  ...overrides,
});

const makeEvent = (
  overrides: Partial<RewardableEvent> = {},
): RewardableEvent => ({
  delivery: { id: 'delivery-1', signature: 'sha256=abc', hookId: 'hook-1' },
  name: 'push',
  installationId: INSTALLATION_ID,
  repositoryId: REPOSITORY_ID,
  contributions: [{ actor: { login: 'octocat' }, count: 1 }],
  ...overrides,
});

const inMemoryDirectory = (
  users: LinkedUser[],
  status: InstallationStatus | null = {
    isSuspended: false,
    isRepositorySelected: true,
  },
): RewardDirectory => ({
  getInstallationStatus: async () => status,
  findLinkedUsers: async actors =>
    users.filter(user =>
      actors.some(actor =>
        'githubId' in actor
          ? actor.githubId === user.githubId
          : actor.login === user.login,
      ),
    ),
});

const recordingSink = () => {
  const applied: RecipientRewards[] = [];
  const sink: RewardSink = {
    apply: async recipientRewards => {
      applied.push(recipientRewards);
    },
  };

  return { sink, applied };
};

const recordingLog = () => {
  const recorded: { event: string; login: string }[] = [];
  const log: RewardLog = {
    record: async (event, recipient) => {
      recorded.push({ event: event.name, login: recipient.login });
    },
  };

  return { log, recorded };
};

describe('deliverRewards', () => {
  it('rewards a commit author once per commit', async () => {
    const { sink, applied } = recordingSink();
    const { log } = recordingLog();

    await deliverRewards(
      makeEvent({ contributions: [{ actor: { login: 'octocat' }, count: 3 }] }),
      { directory: inMemoryDirectory([makeUser()]), sink, log },
    );

    expect(applied).toHaveLength(1);
    expect(applied[0].recipient.login).toBe('octocat');
    expect(applied[0].rewards).toEqual([
      {
        triggerUuid: 'trigger-1',
        task: {
          title: 'Write code',
          alias: undefined,
          note: undefined,
          priority: 1,
          attribute: 'str',
          frequency: 'daily',
        },
        direction: TaskDirection.UP,
        times: 3,
      },
    ]);
  });

  it('matches event senders by GitHub ID', async () => {
    const { sink, applied } = recordingSink();
    const { log } = recordingLog();
    const user = makeUser({
      triggers: [
        makeTrigger({ event: 'pull_request.closed', scoreDirection: 'down' }),
      ],
    });

    await deliverRewards(
      makeEvent({
        name: 'pull_request.closed',
        contributions: [{ actor: { githubId: 42 }, count: 1 }],
      }),
      { directory: inMemoryDirectory([user]), sink, log },
    );

    expect(applied[0].rewards[0]).toMatchObject({
      direction: TaskDirection.DOWN,
      times: 1,
    });
  });

  it('only uses active triggers for the same event', async () => {
    const { sink, applied } = recordingSink();
    const { log } = recordingLog();
    const user = makeUser({
      triggers: [
        makeTrigger({ uuid: 'active' }),
        makeTrigger({ uuid: 'inactive', isActive: false }),
        makeTrigger({ uuid: 'other-event', event: 'star.created' }),
      ],
    });

    await deliverRewards(makeEvent(), {
      directory: inMemoryDirectory([user]),
      sink,
      log,
    });

    expect(applied[0].rewards.map(reward => reward.triggerUuid)).toEqual([
      'active',
    ]);
  });

  it('only uses triggers set up for the repository', async () => {
    const { sink, applied } = recordingSink();
    const { log } = recordingLog();
    const user = makeUser({
      triggers: [
        makeTrigger({ uuid: 'this-repo' }),
        makeTrigger({ uuid: 'other-repo', repositoryIds: [999] }),
      ],
    });

    await deliverRewards(makeEvent(), {
      directory: inMemoryDirectory([user]),
      sink,
      log,
    });

    expect(applied[0].rewards.map(reward => reward.triggerUuid)).toEqual([
      'this-repo',
    ]);
  });

  it.each([
    ['the installation is unknown', null],
    [
      'the installation is suspended',
      { isSuspended: true, isRepositorySelected: true },
    ],
    [
      'the repository is not selected',
      { isSuspended: false, isRepositorySelected: false },
    ],
  ])('rewards nobody when %s', async (_, status) => {
    const { sink, applied } = recordingSink();
    const { log } = recordingLog();

    await deliverRewards(makeEvent(), {
      directory: inMemoryDirectory([makeUser()], status),
      sink,
      log,
    });

    expect(applied).toHaveLength(0);
  });

  it('only rewards the owner of the installation', async () => {
    const { sink, applied } = recordingSink();
    const { log } = recordingLog();
    const stranger = makeUser({ installationId: 999 });

    await deliverRewards(makeEvent(), {
      directory: inMemoryDirectory([stranger]),
      sink,
      log,
    });

    expect(applied).toHaveLength(0);
  });

  it('skips users without matching triggers', async () => {
    const { sink, applied } = recordingSink();
    const { log } = recordingLog();

    await deliverRewards(makeEvent(), {
      directory: inMemoryDirectory([makeUser({ triggers: [] })]),
      sink,
      log,
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
        name: 'pull_request.closed',
        contributions: [{ actor: { githubId: 42 }, count: 1 }],
      }),
      { directory: inMemoryDirectory([user]), sink, log },
    );

    expect(recorded).toEqual([
      { event: 'pull_request.closed', login: 'octocat' },
    ]);
  });

  it('records nothing when nobody is rewarded', async () => {
    const { sink } = recordingSink();
    const { log, recorded } = recordingLog();

    await deliverRewards(makeEvent({ name: 'star.created' }), {
      directory: inMemoryDirectory([makeUser()]),
      sink,
      log,
    });

    expect(recorded).toHaveLength(0);
  });
});
