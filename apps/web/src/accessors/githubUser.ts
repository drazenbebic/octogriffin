'use server';

import { EmitterWebhookEventName } from '@octokit/webhooks';

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

  return user as Prisma.GithubUsersGetPayload<{ include: T }> | null;
};

export const getGithubUserUserByLogin = async <
  T extends Prisma.GithubUsersInclude,
>(
  login: string,
  include?: T,
) => {
  const user = await getGithubUser({ login }, include);

  return user as Prisma.GithubUsersGetPayload<{ include: T }> | null;
};

export const getGithubUserBySenderId = async <
  T extends Prisma.GithubUsersInclude,
>(
  senderId: number,
  include?: T,
) => {
  const user = await getGithubUser({ githubId: senderId }, include);

  return user as Prisma.GithubUsersGetPayload<{ include: T }> | null;
};

export const getLinkedGithubUser = async (
  senderId: number,
  event: EmitterWebhookEventName,
) => {
  return prisma.githubUsers.findUnique({
    where: {
      githubId: senderId,
      habiticaUser: { isNot: null },
      triggers: {
        some: {
          isActive: true,
          event: event,
        },
      },
    },
    include: {
      habiticaUser: true,
      triggers: {
        where: {
          isActive: true,
          event,
        },
      },
    },
  });
};

export const getLinkedGithubUsers = async (
  usernames: string[],
  event: EmitterWebhookEventName,
) => {
  return prisma.githubUsers.findMany({
    where: {
      login: { in: usernames },
      habiticaUser: { isNot: null },
      triggers: {
        some: {
          isActive: true,
          event: event,
        },
      },
    },
    include: {
      habiticaUser: true,
      triggers: {
        where: {
          isActive: true,
          event,
        },
      },
    },
  });
};
