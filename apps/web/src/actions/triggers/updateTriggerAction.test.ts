import { getServerSession } from 'next-auth';

import { getGithubUserByGithubId } from '@/accessors/githubUser';
import { ownsRepositories } from '@/accessors/repository';
import { getTrigger, updateTrigger } from '@/accessors/trigger';
import type { TriggerSchema } from '@/schemas/triggerSchema';

import { updateTriggerAction } from './updateTriggerAction';

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('@/lib/auth', () => ({ authOptions: {} }));
jest.mock('@/accessors/githubUser', () => ({
  getGithubUserByGithubId: jest.fn(),
}));
jest.mock('@/accessors/repository', () => ({ ownsRepositories: jest.fn() }));
jest.mock('@/accessors/trigger', () => ({
  getTrigger: jest.fn(),
  updateTrigger: jest.fn(),
}));
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { error: jest.fn() },
}));

const mockGetTrigger = getTrigger as jest.Mock;
const mockUpdateTrigger = updateTrigger as jest.Mock;

const trigger: TriggerSchema = {
  event: 'push',
  repositories: ['repository-uuid'],
  scoreDirection: 'up',
  taskAttribute: 'str',
  taskFrequency: 'daily',
  taskPriority: 1,
  taskTitle: 'Write code',
};

describe('updateTriggerAction', () => {
  beforeEach(() => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { githubId: 1 },
    });
    (getGithubUserByGithubId as jest.Mock).mockResolvedValue({
      id: BigInt(7),
    });
    (ownsRepositories as jest.Mock).mockResolvedValue(true);
    mockGetTrigger.mockResolvedValue({ id: BigInt(3) });
    mockUpdateTrigger.mockResolvedValue({ uuid: 'trigger-uuid' });
  });

  it('saves a changed cooldown', async () => {
    await updateTriggerAction('trigger-uuid', {
      ...trigger,
      cooldownAmount: 2,
      cooldownUnit: 'hours',
    });

    expect(mockUpdateTrigger).toHaveBeenCalledWith(
      { id: BigInt(3) },
      expect.objectContaining({ cooldownSeconds: 7200 }),
    );
  });

  it('clears the cooldown', async () => {
    await updateTriggerAction('trigger-uuid', trigger);

    expect(mockUpdateTrigger).toHaveBeenCalledWith(
      { id: BigInt(3) },
      expect.objectContaining({ cooldownSeconds: null }),
    );
  });

  it("refuses a trigger that isn't yours", async () => {
    mockGetTrigger.mockResolvedValue(null);

    const result = await updateTriggerAction('trigger-uuid', trigger);

    expect(result.success).toBe(false);
    expect(mockUpdateTrigger).not.toHaveBeenCalled();
  });
});
