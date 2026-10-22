import { getServerSession } from 'next-auth';

import { getGithubUserByGithubId } from '@/accessors/githubUser';
import { ownsRepositories } from '@/accessors/repository';
import { createTrigger } from '@/accessors/trigger';
import type { TriggerSchema } from '@/schemas/triggerSchema';

import { createTriggerAction } from './createTriggerAction';

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('@/lib/auth', () => ({ authOptions: {} }));
jest.mock('@/accessors/githubUser', () => ({
  getGithubUserByGithubId: jest.fn(),
}));
jest.mock('@/accessors/repository', () => ({ ownsRepositories: jest.fn() }));
jest.mock('@/accessors/trigger', () => ({ createTrigger: jest.fn() }));
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { error: jest.fn() },
}));

const mockOwnsRepositories = ownsRepositories as jest.Mock;
const mockCreateTrigger = createTrigger as jest.Mock;

const trigger: TriggerSchema = {
  event: 'push',
  repositories: ['repository-uuid'],
  scoreDirection: 'up',
  taskAttribute: 'str',
  taskFrequency: 'daily',
  taskPriority: 1,
  taskTitle: 'Write code',
};

describe('createTriggerAction', () => {
  beforeEach(() => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { githubId: 1 },
    });
    (getGithubUserByGithubId as jest.Mock).mockResolvedValue({
      id: BigInt(7),
    });
    mockCreateTrigger.mockResolvedValue({ uuid: 'trigger-uuid' });
  });

  it('creates a trigger for your own repositories', async () => {
    mockOwnsRepositories.mockResolvedValue(true);

    const result = await createTriggerAction(trigger);

    expect(result.success).toBe(true);
    expect(mockOwnsRepositories).toHaveBeenCalledWith(BigInt(7), [
      'repository-uuid',
    ]);
  });

  it("refuses repositories you didn't add Octogriffin to", async () => {
    mockOwnsRepositories.mockResolvedValue(false);

    const result = await createTriggerAction(trigger);

    expect(result).toEqual({
      error: 'Please only select repositories you added Octogriffin to.',
      success: false,
    });
    expect(mockCreateTrigger).not.toHaveBeenCalled();
  });
});
