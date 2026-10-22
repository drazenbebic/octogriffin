import type { EmitterWebhookEvent } from '@octokit/webhooks';

import {
  addSelectedRepositories,
  getGithubInstallation,
  removeSelectedRepositories,
} from '@/accessors/githubInstallation';
import { deliverRewards } from '@/rewards/deliverRewards';

import type { WebhookEventName } from './handleUniversal';
import { handleUniversal } from './handleUniversal';

jest.mock('@/accessors/githubInstallation', () => ({
  addSelectedRepositories: jest.fn(),
  getGithubInstallation: jest.fn(),
  removeSelectedRepositories: jest.fn(),
}));
jest.mock('@/rewards/deliverRewards', () => ({ deliverRewards: jest.fn() }));
jest.mock('@/rewards/rewardDeps', () => ({ rewardDeps: {} }));
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { info: jest.fn() },
}));

const calls: string[] = [];

const repository = {
  full_name: 'octocat/hello-world',
  id: 200,
  name: 'hello-world',
  node_id: 'R_200',
  private: false,
};

const event = {
  id: 'delivery-1',
  payload: { installation: { id: 100 }, repository, sender: { id: 1 } },
} as unknown as EmitterWebhookEvent<WebhookEventName>;

describe('handleUniversal', () => {
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
    await handleUniversal(event, 'repository.created');

    expect(calls).toEqual(['add', 'reward']);
    expect(addSelectedRepositories).toHaveBeenCalledWith(BigInt(9), [
      repository,
    ]);
  });

  it('removes a deleted repository after rewarding its deletion', async () => {
    await handleUniversal(event, 'repository.deleted');

    expect(calls).toEqual(['reward', 'remove']);
    expect(removeSelectedRepositories).toHaveBeenCalledWith(BigInt(9), [200]);
  });

  it('leaves the repositories alone for other events', async () => {
    await handleUniversal(event, 'star.created');

    expect(calls).toEqual(['reward']);
  });
});
