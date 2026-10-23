import { getServerSession } from 'next-auth';

import { getGithubUserByGithubId } from '@/accessors/githubUser';
import { upsertHabiticaUser } from '@/accessors/habiticaUser';
import { Prisma } from '@/generated/prisma/client';

import { upsertHabiticaUserAction } from './upsertHabiticaUserAction';

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('@/lib/auth', () => ({ authOptions: {} }));
jest.mock('@/accessors/githubUser', () => ({
  getGithubUserByGithubId: jest.fn(),
}));
jest.mock('@/accessors/habiticaUser', () => ({
  upsertHabiticaUser: jest.fn(),
}));
jest.mock('@/lib/HabiticaApi', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getUserStats: jest.fn().mockResolvedValue({ stats: {} }),
  })),
}));
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { error: jest.fn() },
}));

const mockUpsert = upsertHabiticaUser as jest.Mock;

const credentials = { apiToken: 'token', userId: 'habitica-user' };

describe('upsertHabiticaUserAction', () => {
  beforeEach(() => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { githubId: 1 },
    });
    (getGithubUserByGithubId as jest.Mock).mockResolvedValue({
      habiticaUser: null,
      id: BigInt(7),
    });
  });

  it('links the Habitica account', async () => {
    mockUpsert.mockResolvedValue({ userId: 'habitica-user' });

    await expect(upsertHabiticaUserAction(credentials)).resolves.toEqual({
      data: { hasApiToken: true, userId: 'habitica-user' },
      success: true,
    });
  });

  it('explains that the Habitica account is linked to someone else', async () => {
    mockUpsert.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        clientVersion: 'test',
        code: 'P2002',
      }),
    );

    await expect(upsertHabiticaUserAction(credentials)).resolves.toEqual({
      error:
        'This Habitica account is already linked to another GitHub account.',
      success: false,
    });
  });
});
