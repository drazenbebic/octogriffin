import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';

type GithubUsersClient = Pick<typeof prisma, 'githubUsers'>;

export const getGithubUser = async <T extends Prisma.GithubUsersInclude>(
  where: Prisma.GithubUsersWhereUniqueInput,
  include?: T,
) => {
  const user = await prisma.githubUsers.findUnique({
    include,
    where,
  });

  return user as null | Prisma.GithubUsersGetPayload<{ include: T }>;
};

export const getGithubUserByGithubId = async <
  T extends Prisma.GithubUsersInclude,
>(
  githubId: number,
  include?: T,
) => {
  return getGithubUser({ githubId }, include);
};

/**
 * Logins change hands: once someone renames their GitHub account, anybody can
 * take their old login. Moves a login away from a user who no longer has it,
 * so it can be saved for `githubId`. The previous user gets their current
 * login back the next time they sign in.
 */
export const releaseGithubLogin = async (
  client: GithubUsersClient,
  login: string,
  githubId: number,
) => {
  const previousUser = await client.githubUsers.findUnique({
    select: { githubId: true },
    where: { login },
  });

  if (!previousUser || previousUser.githubId === githubId) {
    return;
  }

  await client.githubUsers.update({
    // GitHub logins can't contain a colon, so this never takes a real one
    data: { login: `renamed:${previousUser.githubId}` },
    where: { githubId: previousUser.githubId },
  });
};
