import { getServerSession } from 'next-auth';

import { z } from 'zod';

import { getGithubUserUserByLogin } from '@/accessors/githubUser';

import { ActionError, parseInput, runUserAction } from './userAction';

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('@/lib/auth', () => ({ authOptions: {} }));
jest.mock('@/accessors/githubUser', () => ({
  getGithubUserUserByLogin: jest.fn(),
}));
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { error: jest.fn(), info: jest.fn() },
}));

const mockSession = getServerSession as jest.Mock;
const mockGetGithubUser = getGithubUserUserByLogin as jest.Mock;

const githubUser = { id: BigInt(1), login: 'octocat' };

describe('runUserAction', () => {
  beforeEach(() => {
    mockSession.mockResolvedValue({ user: { name: 'octocat' } });
    mockGetGithubUser.mockResolvedValue(githubUser);
  });

  it('passes the signed-in GitHub user to the handler', async () => {
    const result = await runUserAction('test', async user => user.login, {
      habiticaUser: true,
    });

    expect(result).toEqual({ success: true, data: 'octocat' });
    expect(mockGetGithubUser).toHaveBeenCalledWith('octocat', {
      habiticaUser: true,
    });
  });

  it('fails when nobody is signed in', async () => {
    mockSession.mockResolvedValue(null);
    const handler = jest.fn();

    await expect(runUserAction('test', handler)).resolves.toEqual({
      success: false,
      error: 'Unauthorized',
    });
    expect(handler).not.toHaveBeenCalled();
  });

  it('fails when the GitHub user is unknown', async () => {
    mockGetGithubUser.mockResolvedValue(null);

    await expect(runUserAction('test', jest.fn())).resolves.toEqual({
      success: false,
      error: 'GitHub user account not found.',
    });
  });

  it('shows the message of an ActionError', async () => {
    const result = await runUserAction('test', async () => {
      throw new ActionError('Trigger not found.');
    });

    expect(result).toEqual({ success: false, error: 'Trigger not found.' });
  });

  it('hides the details of unexpected errors', async () => {
    const result = await runUserAction('test', async () => {
      throw new Error('connection refused');
    });

    expect(result).toEqual({
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    });
  });

  it('rejects invalid input', async () => {
    const result = await runUserAction('test', async () =>
      parseInput(z.object({ title: z.string().min(1) }), { title: '' }),
    );

    expect(result).toEqual({
      success: false,
      error: 'Invalid form data provided.',
    });
  });
});
