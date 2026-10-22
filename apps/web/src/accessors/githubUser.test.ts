import { releaseGithubLogin } from './githubUser';

jest.mock('@/lib/prisma', () => ({ __esModule: true, default: {} }));

const createClient = (holder: { githubId: number } | null) => ({
  githubUsers: {
    findUnique: jest.fn().mockResolvedValue(holder),
    update: jest.fn(),
  },
});

describe('releaseGithubLogin', () => {
  it('moves a login away from a user who renamed their account', async () => {
    const client = createClient({ githubId: 1 });

    await releaseGithubLogin(client as never, 'octocat', 2);

    expect(client.githubUsers.update).toHaveBeenCalledWith({
      data: { login: 'renamed:1' },
      where: { githubId: 1 },
    });
  });

  it('leaves a login with the user who still has it', async () => {
    const client = createClient({ githubId: 2 });

    await releaseGithubLogin(client as never, 'octocat', 2);

    expect(client.githubUsers.update).not.toHaveBeenCalled();
  });

  it('does nothing for a login nobody has', async () => {
    const client = createClient(null);

    await releaseGithubLogin(client as never, 'octocat', 2);

    expect(client.githubUsers.update).not.toHaveBeenCalled();
  });
});
