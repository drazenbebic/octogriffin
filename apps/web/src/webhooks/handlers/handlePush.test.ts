import type { RewardDeps } from '@/rewards/deliverRewards';
import { deliverRewards } from '@/rewards/deliverRewards';
import type { WebhookEvent } from '@/webhooks/types';

import { handlePush } from './handlePush';

jest.mock('@/rewards/deliverRewards', () => ({ deliverRewards: jest.fn() }));
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { info: jest.fn() },
}));

const mockDeliverRewards = deliverRewards as jest.Mock;
const deps = { rewards: {} as RewardDeps };

const changesAFile = { added: [], modified: ['a.ts'], removed: [] };
const changesNothing = { added: [], modified: [], removed: [] };

const commit = (
  username: string,
  distinct = true,
  files: {
    added: string[];
    modified: string[];
    removed: string[];
  } = changesAFile,
) => ({
  author: { username },
  distinct,
  ...files,
});

const push = (commits: ({ message?: string } & ReturnType<typeof commit>)[]) =>
  ({
    delivery: { hookId: 'hook-1', id: 'delivery-1', signature: 'sha256=abc' },
    name: 'push',
    payload: {
      commits,
      installation: { id: 100 },
      repository: { id: 200 },
    },
  }) as unknown as WebhookEvent<'push'>;

describe('handlePush', () => {
  it('counts the new commits of each author', async () => {
    await handlePush(
      push([commit('octocat'), commit('octocat'), commit('hubot')]),
      deps,
    );

    expect(mockDeliverRewards.mock.calls[0][0].contributions).toEqual([
      { actor: { login: 'octocat' }, count: 2, spamCount: 0 },
      { actor: { login: 'hubot' }, count: 1, spamCount: 0 },
    ]);
  });

  it('skips commits that were pushed before', async () => {
    await handlePush(push([commit('octocat'), commit('octocat', false)]), deps);

    expect(mockDeliverRewards.mock.calls[0][0].contributions).toEqual([
      { actor: { login: 'octocat' }, count: 1, spamCount: 0 },
    ]);
  });

  it('skips bots', async () => {
    await handlePush(push([commit('dependabot[bot]')]), deps);

    expect(mockDeliverRewards.mock.calls[0][0].contributions).toEqual([]);
  });

  it('counts the empty commits of each author as spam', async () => {
    await handlePush(
      push([
        commit('octocat'),
        commit('octocat'),
        commit('octocat', true, changesNothing),
        commit('hubot', true, changesNothing),
      ]),
      deps,
    );

    expect(mockDeliverRewards.mock.calls[0][0].contributions).toEqual([
      { actor: { login: 'octocat' }, count: 3, spamCount: 1 },
      { actor: { login: 'hubot' }, count: 1, spamCount: 1 },
    ]);
  });

  it('never counts bot commits, empty or not', async () => {
    await handlePush(
      push([commit('dependabot[bot]', true, changesNothing)]),
      deps,
    );

    expect(mockDeliverRewards.mock.calls[0][0].contributions).toEqual([]);
  });

  it('counts a merge commit, which GitHub sends without files', async () => {
    await handlePush(
      push([
        {
          ...commit('octocat', true, changesNothing),
          message: 'Merge pull request #12 from octocat/feature',
        },
      ]),
      deps,
    );

    expect(mockDeliverRewards.mock.calls[0][0].contributions).toEqual([
      { actor: { login: 'octocat' }, count: 1, spamCount: 0 },
    ]);
  });
});
