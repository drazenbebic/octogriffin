import {
  fakeRewardDeps,
  INSTALLATION_ID,
  makeTrigger,
  makeUser,
  REPOSITORY_ID,
} from '@/rewards/testFakes';
import type { WebhookEvent } from '@/webhooks/types';

import { handlePush } from './handlePush';

jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { info: jest.fn() },
}));

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
      installation: { id: INSTALLATION_ID },
      repository: { id: REPOSITORY_ID },
    },
  }) as unknown as WebhookEvent<'push'>;

// Everyone has a push trigger with Skip spam on, bots included
const linkedUsers = () => [
  makeUser(),
  makeUser({
    githubId: 43,
    id: BigInt(2),
    login: 'hubot',
    triggers: [makeTrigger({ uuid: 'trigger-2' })],
  }),
  makeUser({
    githubId: 44,
    id: BigInt(3),
    login: 'dependabot[bot]',
    triggers: [makeTrigger({ uuid: 'trigger-3' })],
  }),
];

/** Handles a push of `commits`, returning what each linked user scored. */
const handle = async (commits: Parameters<typeof push>[0]) => {
  const { deps, scored } = fakeRewardDeps(linkedUsers());

  await handlePush(push(commits), { rewards: deps });

  return scored();
};

describe('handlePush', () => {
  it('rewards each author once per new commit', async () => {
    expect(
      await handle([commit('octocat'), commit('octocat'), commit('hubot')]),
    ).toEqual([
      { login: 'octocat', times: 2, trigger: 'trigger-1' },
      { login: 'hubot', times: 1, trigger: 'trigger-2' },
    ]);
  });

  it('skips commits that were pushed before', async () => {
    expect(await handle([commit('octocat'), commit('octocat', false)])).toEqual(
      [{ login: 'octocat', times: 1, trigger: 'trigger-1' }],
    );
  });

  it.each([
    ['changes a file', changesAFile],
    ['is empty', changesNothing],
  ])('never rewards a bot commit that %s', async (_, files) => {
    expect(await handle([commit('dependabot[bot]', true, files)])).toEqual([]);
  });

  it('leaves out empty commits when Skip spam is on', async () => {
    expect(
      await handle([
        commit('octocat'),
        commit('octocat'),
        commit('octocat', true, changesNothing),
        commit('hubot', true, changesNothing),
      ]),
    ).toEqual([{ login: 'octocat', times: 2, trigger: 'trigger-1' }]);
  });

  it('rewards a merge commit, which GitHub sends without files', async () => {
    expect(
      await handle([
        {
          ...commit('octocat', true, changesNothing),
          message: 'Merge pull request #12 from octocat/feature',
        },
      ]),
    ).toEqual([{ login: 'octocat', times: 1, trigger: 'trigger-1' }]);
  });
});
