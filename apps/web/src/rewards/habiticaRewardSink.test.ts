import { TaskAttribute, TaskDirection, TaskFrequency } from '@/enums/habitica';
import HabiticaApi from '@/lib/HabiticaApi';

import { habiticaRewardSink } from './habiticaRewardSink';
import type { RecipientRewards, Reward } from './types';

jest.mock('@/lib/HabiticaApi');
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

const mockHabitica = (failingTitles: string[]) => {
  const scoreTask = jest.fn().mockResolvedValue({});

  MockHabiticaApi.mockImplementation(
    () =>
      ({
        findOrCreateTask: jest.fn(async ({ text }) => {
          if (failingTitles.includes(text)) {
            throw new Error('Habitica is down');
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

  it('fails when not a single reward could be scored', async () => {
    mockHabitica(['Code']);

    await expect(
      habiticaRewardSink.apply(recipientRewards([reward('Code')])),
    ).rejects.toThrow('No reward could be scored.');
  });

  it('keeps the rewards that were scored when others fail', async () => {
    const { scoreTask } = mockHabitica(['Review']);

    await habiticaRewardSink.apply(
      recipientRewards([reward('Code'), reward('Review')]),
    );

    expect(scoreTask).toHaveBeenCalledTimes(1);
  });
});
