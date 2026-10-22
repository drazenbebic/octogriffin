'use server';

import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';

export const getGithubUser = async <T extends Prisma.GithubUsersInclude>(
  where: Prisma.GithubUsersWhereUniqueInput,
  include?: T,
) => {
  const user = await prisma.githubUsers.findUnique({
    where,
    include,
  });

  return user as null | Prisma.GithubUsersGetPayload<{ include: T }>;
};

export const getGithubUserUserByLogin = async <
  T extends Prisma.GithubUsersInclude,
>(
  login: string,
  include?: T,
) => {
  const user = await getGithubUser({ login }, include);

  return user as null | Prisma.GithubUsersGetPayload<{ include: T }>;
};
