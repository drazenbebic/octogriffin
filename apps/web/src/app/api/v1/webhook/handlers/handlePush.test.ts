import type { EmitterWebhookEvent } from '@octokit/webhooks';

import { deliverRewards } from '@/rewards/deliverRewards';

import { handlePush } from './handlePush';

jest.mock('@/rewards/deliverRewards', () => ({ deliverRewards: jest.fn() }));
jest.mock('@/rewards/rewardDeps', () => ({ rewardDeps: {} }));
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { info: jest.fn() },
}));

const mockDeliverRewards = deliverRewards as jest.Mock;

const commit = (username: string, distinct = true) => ({
  author: { username },
  distinct,
});

const push = (commits: ReturnType<typeof commit>[]) =>
  ({
    id: 'delivery-1',
    name: 'push',
    payload: {
      commits,
      installation: { id: 100 },
      repository: { id: 200 },
    },
  }) as unknown as EmitterWebhookEvent<'push'>;

describe('handlePush', () => {
  it('counts the new commits of each author', async () => {
    await handlePush(
      push([commit('octocat'), commit('octocat'), commit('hubot')]),
    );

    expect(mockDeliverRewards.mock.calls[0][0].contributions).toEqual([
      { actor: { login: 'octocat' }, count: 2 },
      { actor: { login: 'hubot' }, count: 1 },
    ]);
  });

  it('skips commits that were pushed before', async () => {
    await handlePush(push([commit('octocat'), commit('octocat', false)]));

    expect(mockDeliverRewards.mock.calls[0][0].contributions).toEqual([
      { actor: { login: 'octocat' }, count: 1 },
    ]);
  });

  it('skips bots', async () => {
    await handlePush(push([commit('dependabot[bot]')]));

    expect(mockDeliverRewards.mock.calls[0][0].contributions).toEqual([]);
  });
});
