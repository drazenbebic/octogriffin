import { TaskAttribute, TaskDirection, TaskFrequency } from '@/enums/habitica';
import HabiticaApi, { HabiticaApiError } from '@/lib/HabiticaApi';

import { habiticaRewardSink } from './habiticaRewardSink';
import type { RecipientRewards, Reward } from './types';

jest.mock('@/lib/HabiticaApi', () => ({
  ...jest.requireActual('@/lib/HabiticaApi'),
  __esModule: true,
  default: jest.fn(),
}));
// p-queue is ESM only, which Jest can't load
jest.mock('p-queue', () => ({
  __esModule: true,
  default: class {
    addAll(tasks: (() => Promise<unknown>)[]) {
      return Promise.all(tasks.map(task => task()));
    }
  },
}));
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { error: jest.fn(), info: jest.fn() },
}));

const MockHabiticaApi = HabiticaApi as jest.MockedClass<typeof HabiticaApi>;

const reward = (title: string, times = 1): Reward => ({
  direction: TaskDirection.UP,
  task: {
    attribute: TaskAttribute.STR,
    frequency: TaskFrequency.DAILY,
    priority: 1,
    title,
  },
  times,
  triggerUuid: title,
});

const recipientRewards = (rewards: Reward[]): RecipientRewards => ({
  recipient: {
    credentials: { apiToken: 'token', userId: 'user' },
    githubUserId: BigInt(1),
    login: 'octocat',
  },
  rewards,
});

const mockHabitica = (
  failingTitles: string[],
  error: Error = new Error('Habitica is down'),
) => {
  const scoreTask = jest.fn().mockResolvedValue({});

  MockHabiticaApi.mockImplementation(
    () =>
      ({
        findOrCreateTask: jest.fn(async ({ text }) => {
          if (failingTitles.includes(text)) {
            throw error;
          }

          return { id: text };
        }),
        scoreTask,
      }) as unknown as HabiticaApi,
  );

  return { scoreTask };
};

describe('habiticaRewardSink', () => {
  it('scores every reward as often as it was earned', async () => {
    const { scoreTask } = mockHabitica([]);

    await habiticaRewardSink.apply(recipientRewards([reward('Code', 2)]));

    expect(scoreTask).toHaveBeenCalledTimes(2);
  });

  it.each([
    ['Habitica is unreachable', new Error('fetch failed'), true],
    ['Habitica is down', new HabiticaApiError('Unavailable', 503), true],
    ['Habitica is busy', new HabiticaApiError('Too Many Requests', 429), true],
    [
      'the API token is wrong',
      new HabiticaApiError('Unauthorized', 401),
      false,
    ],
    ['the task is invalid', new HabiticaApiError('Bad Request', 400), false],
  ])(
    'fails when nothing could be scored because %s',
    async (_, error, isRetryable) => {
      mockHabitica(['Code'], error);

      await expect(
        habiticaRewardSink.apply(recipientRewards([reward('Code')])),
      ).rejects.toMatchObject({
        isRetryable,
        message: 'No reward could be scored.',
      });
    },
  );

  it('keeps the rewards that were scored when others fail', async () => {
    const { scoreTask } = mockHabitica(['Review']);

    await habiticaRewardSink.apply(
      recipientRewards([reward('Code'), reward('Review')]),
    );

    expect(scoreTask).toHaveBeenCalledTimes(1);
  });
  it('reports every trigger that scored', async () => {
    mockHabitica([]);

    await expect(
      habiticaRewardSink.apply(
        recipientRewards([reward('Code'), reward('Review')]),
      ),
    ).resolves.toEqual({ Code: 1, Review: 1 });
  });

  it('leaves out triggers that failed', async () => {
    mockHabitica(['Review']);

    await expect(
      habiticaRewardSink.apply(
        recipientRewards([reward('Code'), reward('Review')]),
      ),
    ).resolves.toEqual({ Code: 1 });
  });

  it('reports a trigger that scored only partly', async () => {
    const { scoreTask } = mockHabitica([]);

    scoreTask
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error('Habitica is down'));

    await expect(
      habiticaRewardSink.apply(recipientRewards([reward('Code', 3)])),
    ).resolves.toEqual({ Code: 1 });
  });

  it('counts every time a trigger scored', async () => {
    mockHabitica([]);

    await expect(
      habiticaRewardSink.apply(recipientRewards([reward('Code', 3)])),
    ).resolves.toEqual({ Code: 3 });
  });
});
