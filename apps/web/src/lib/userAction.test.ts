import { getServerSession } from 'next-auth';

import { z } from 'zod';

import { getGithubUserByGithubId } from '@/accessors/githubUser';

import { ActionError, parseInput, runUserAction } from './userAction';

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('@/lib/auth', () => ({ authOptions: {} }));
jest.mock('@/accessors/githubUser', () => ({
  getGithubUserByGithubId: jest.fn(),
}));
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { error: jest.fn(), info: jest.fn() },
}));

const mockSession = getServerSession as jest.Mock;
const mockGetGithubUser = getGithubUserByGithubId as jest.Mock;

const githubUser = { id: BigInt(1), login: 'octocat' };

describe('runUserAction', () => {
  beforeEach(() => {
    mockSession.mockResolvedValue({
      user: { githubId: 583231, name: 'octocat' },
    });
    mockGetGithubUser.mockResolvedValue(githubUser);
  });

  it('passes the signed-in GitHub user to the handler', async () => {
    const result = await runUserAction('test', async user => user.login, {
      habiticaUser: true,
    });

    expect(result).toEqual({ data: 'octocat', success: true });
    expect(mockGetGithubUser).toHaveBeenCalledWith(583231, {
      habiticaUser: true,
    });
  });

  it('fails for a session without a GitHub ID', async () => {
    mockSession.mockResolvedValue({ user: { name: 'octocat' } });
    const handler = jest.fn();

    await expect(runUserAction('test', handler)).resolves.toEqual({
      error: 'Unauthorized',
      success: false,
    });
    expect(handler).not.toHaveBeenCalled();
  });

  it('fails when nobody is signed in', async () => {
    mockSession.mockResolvedValue(null);
    const handler = jest.fn();

    await expect(runUserAction('test', handler)).resolves.toEqual({
      error: 'Unauthorized',
      success: false,
    });
    expect(handler).not.toHaveBeenCalled();
  });

  it('fails when the GitHub user is unknown', async () => {
    mockGetGithubUser.mockResolvedValue(null);

    await expect(runUserAction('test', jest.fn())).resolves.toEqual({
      error: 'GitHub user account not found.',
      success: false,
    });
  });

  it('shows the message of an ActionError', async () => {
    const result = await runUserAction('test', async () => {
      throw new ActionError('Trigger not found.');
    });

    expect(result).toEqual({ error: 'Trigger not found.', success: false });
  });

  it('hides the details of unexpected errors', async () => {
    const result = await runUserAction('test', async () => {
      throw new Error('connection refused');
    });

    expect(result).toEqual({
      error: 'An unexpected error occurred. Please try again later.',
      success: false,
    });
  });

  it('rejects invalid input', async () => {
    const result = await runUserAction('test', async () =>
      parseInput(z.object({ title: z.string().min(1) }), { title: '' }),
    );

    expect(result).toEqual({
      error: 'Invalid form data provided.',
      success: false,
    });
  });
});
