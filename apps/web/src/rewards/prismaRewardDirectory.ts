import { getInstallationStatus } from '@/accessors/githubInstallation';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

import type { RewardDirectory } from './types';

export const prismaRewardDirectory: RewardDirectory = {
  findLinkedUsers: async actors => {
    const githubIds = actors.flatMap(actor =>
      'githubId' in actor ? [actor.githubId] : [],
    );
    const logins = actors.flatMap(actor =>
      'login' in actor ? [actor.login] : [],
    );

    const users = await prisma.githubUsers.findMany({
      include: {
        habiticaUser: true,
        installations: { select: { installationId: true } },
        triggers: {
          include: {
            repositories: { select: { githubRepositoryId: true } },
          },
        },
      },
      where: {
        habiticaUser: { isNot: null },
        OR: [{ githubId: { in: githubIds } }, { login: { in: logins } }],
      },
    });

    return users.flatMap(user => {
      if (user.habiticaUser && !user.habiticaUser.apiToken) {
        logger.error(
          { login: user.login },
          'Ignored: Saved Habitica API token is unreadable.',
        );
      }

      return user.habiticaUser?.apiToken
        ? [
            {
              credentials: {
                apiToken: user.habiticaUser.apiToken,
                userId: user.habiticaUser.userId,
              },
              githubId: user.githubId,
              id: user.id,
              installationIds: user.installations.map(
                ({ installationId }) => installationId,
              ),
              login: user.login,
              triggers: user.triggers.map(trigger => ({
                ...trigger,
                repositoryIds: trigger.repositories.map(
                  repository => repository.githubRepositoryId,
                ),
              })),
            },
          ]
        : [];
    });
  },
  getInstallationStatus,
};
