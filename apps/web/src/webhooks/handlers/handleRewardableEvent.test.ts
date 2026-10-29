import {
  addSelectedRepositories,
  getGithubInstallation,
  removeSelectedRepositories,
} from '@/accessors/githubInstallation';
import {
  fakeRewardDeps,
  INSTALLATION_ID,
  makeTrigger,
  makeUser,
  recordingSink,
  REPOSITORY_ID,
} from '@/rewards/testFakes';
import type { RewardSink } from '@/rewards/types';

import { handleRewardableEvent } from './handleRewardableEvent';

jest.mock('@/accessors/githubInstallation', () => ({
  addSelectedRepositories: jest.fn(),
  getGithubInstallation: jest.fn(),
  removeSelectedRepositories: jest.fn(),
}));
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { info: jest.fn() },
}));

const calls: string[] = [];

/**
 * Handles a delivery of `name`, e.g. `repository.created`, for octocat with a
 * trigger on it, returning what octocat scored.
 */
const handle = async (event: object, name: string, sink?: RewardSink) => {
  const { deps, scored } = fakeRewardDeps(
    [makeUser({ triggers: [makeTrigger({ event: name })] })],
    sink,
  );

  await handleRewardableEvent(
    { ...event, name } as Parameters<typeof handleRewardableEvent>[0],
    { rewards: deps },
  );

  return scored();
};

// Notes when rewards reach Habitica, between the repository updates
const notingSink = (): RewardSink => {
  const { sink } = recordingSink();

  return {
    apply: async recipientRewards => {
      calls.push('reward');

      return sink.apply(recipientRewards);
    },
  };
};

const repository = {
  full_name: 'octocat/hello-world',
  id: REPOSITORY_ID,
  name: 'hello-world',
  node_id: 'R_200',
  private: false,
};

const delivery = {
  hookId: 'hook-1',
  id: 'delivery-1',
  signature: 'sha256=abc',
};

const event = {
  delivery,
  payload: {
    installation: { id: INSTALLATION_ID },
    repository,
    sender: { id: 42 },
  },
};

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
  });

  it('rewards the sender once', async () => {
    expect(await handle(event, 'star.created')).toEqual([
      { login: 'octocat', times: 1, trigger: 'trigger-1' },
    ]);
  });

  it('selects a new repository before rewarding its creation', async () => {
    await handle(event, 'repository.created', notingSink());

    expect(calls).toEqual(['add', 'reward']);
    expect(addSelectedRepositories).toHaveBeenCalledWith(BigInt(9), [
      repository,
    ]);
  });

  it('removes a deleted repository after rewarding its deletion', async () => {
    await handle(event, 'repository.deleted', notingSink());

    expect(calls).toEqual(['reward', 'remove']);
    expect(removeSelectedRepositories).toHaveBeenCalledWith(BigInt(9), [
      REPOSITORY_ID,
    ]);
  });

  it('leaves the repositories alone for other events', async () => {
    await handle(event, 'star.created', notingSink());

    expect(calls).toEqual(['reward']);
  });

  describe('spam', () => {
    const opened = '2026-10-24T10:00:00Z';
    const closed = (closedAfterSeconds: number, authorId = 42) => ({
      delivery,
      payload: {
        ...event.payload,
        pull_request: {
          closed_at: new Date(
            Date.parse(opened) + closedAfterSeconds * 1000,
          ).toISOString(),
          created_at: opened,
          user: { id: authorId },
        },
      },
    });

    it('leaves out a pull request its author closed straight away', async () => {
      expect(await handle(closed(5), 'pull_request.closed')).toEqual([]);
    });

    it('rewards a pull request closed later', async () => {
      expect(await handle(closed(120), 'pull_request.closed')).toEqual([
        { login: 'octocat', times: 1, trigger: 'trigger-1' },
      ]);
    });

    it('rewards a pull request someone else closed', async () => {
      expect(await handle(closed(5, 2), 'pull_request.closed')).toEqual([
        { login: 'octocat', times: 1, trigger: 'trigger-1' },
      ]);
    });

    it('never leaves out other events', async () => {
      expect(await handle(closed(5), 'pull_request.opened')).toEqual([
        { login: 'octocat', times: 1, trigger: 'trigger-1' },
      ]);
    });
  });
});
