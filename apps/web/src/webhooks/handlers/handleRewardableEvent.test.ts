import {
  addSelectedRepositories,
  getGithubInstallation,
  removeSelectedRepositories,
} from '@/accessors/githubInstallation';
import type { RewardDeps } from '@/rewards/deliverRewards';
import { deliverRewards } from '@/rewards/deliverRewards';

import { handleRewardableEvent } from './handleRewardableEvent';

jest.mock('@/accessors/githubInstallation', () => ({
  addSelectedRepositories: jest.fn(),
  getGithubInstallation: jest.fn(),
  removeSelectedRepositories: jest.fn(),
}));
jest.mock('@/rewards/deliverRewards', () => ({ deliverRewards: jest.fn() }));
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { info: jest.fn() },
}));

const calls: string[] = [];
const deps = { rewards: {} as RewardDeps };

/** Runs the handler for a delivery of `name`, e.g. `repository.created`. */
const handle = (event: object, name: string) =>
  handleRewardableEvent(
    { ...event, name } as Parameters<typeof handleRewardableEvent>[0],
    deps,
  );

const repository = {
  full_name: 'octocat/hello-world',
  id: 200,
  name: 'hello-world',
  node_id: 'R_200',
  private: false,
};

const event = {
  delivery: { hookId: 'hook-1', id: 'delivery-1', signature: 'sha256=abc' },
  payload: { installation: { id: 100 }, repository, sender: { id: 1 } },
} as object;

describe('handleRewardableEvent', () => {
  beforeEach(() => {
    calls.length = 0;
    (getGithubInstallation as jest.Mock).mockResolvedValue({ id: BigInt(9) });
    (addSelectedRepositories as jest.Mock).mockImplementation(async () => {
      calls.push('add');
    });
    (removeSelectedRepositories as jest.Mock).mockImplementation(async () => {
      calls.push('remove');
    });
    (deliverRewards as jest.Mock).mockImplementation(async () => {
      calls.push('reward');
    });
  });

  it('selects a new repository before rewarding its creation', async () => {
    await handle(event, 'repository.created');

    expect(calls).toEqual(['add', 'reward']);
    expect(addSelectedRepositories).toHaveBeenCalledWith(BigInt(9), [
      repository,
    ]);
  });

  it('removes a deleted repository after rewarding its deletion', async () => {
    await handle(event, 'repository.deleted');

    expect(calls).toEqual(['reward', 'remove']);
    expect(removeSelectedRepositories).toHaveBeenCalledWith(BigInt(9), [200]);
  });

  it('leaves the repositories alone for other events', async () => {
    await handle(event, 'star.created');

    expect(calls).toEqual(['reward']);
  });

  describe('spam', () => {
    const opened = '2026-10-24T10:00:00Z';
    const closed = (closedAfterSeconds: number, authorId = 1) =>
      ({
        delivery: {
          hookId: 'hook-1',
          id: 'delivery-1',
          signature: 'sha256=abc',
        },
        payload: {
          installation: { id: 100 },
          pull_request: {
            closed_at: new Date(
              Date.parse(opened) + closedAfterSeconds * 1000,
            ).toISOString(),
            created_at: opened,
            user: { id: authorId },
          },
          repository,
          sender: { id: 1 },
        },
      }) as object;
    const contributions = () =>
      (deliverRewards as jest.Mock).mock.calls.at(-1)[0].contributions;

    it('marks a pull request its author closed straight away as spam', async () => {
      await handle(closed(5), 'pull_request.closed');

      expect(contributions()).toEqual([
        { actor: { githubId: 1 }, count: 1, spamCount: 1 },
      ]);
    });

    it('counts a pull request closed later', async () => {
      await handle(closed(120), 'pull_request.closed');

      expect(contributions()).toEqual([
        { actor: { githubId: 1 }, count: 1, spamCount: 0 },
      ]);
    });

    it('counts a pull request someone else closed', async () => {
      await handle(closed(5, 2), 'pull_request.closed');

      expect(contributions()).toEqual([
        { actor: { githubId: 1 }, count: 1, spamCount: 0 },
      ]);
    });

    it('never marks other events as spam', async () => {
      await handle(event, 'issues.opened');

      expect(contributions()).toEqual([
        { actor: { githubId: 1 }, count: 1, spamCount: 0 },
      ]);
    });
  });
});
