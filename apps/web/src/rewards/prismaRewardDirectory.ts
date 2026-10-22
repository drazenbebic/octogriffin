import { getInstallationStatus } from '@/accessors/githubInstallation';
import prisma from '@/lib/prisma';

import { RewardDirectory } from './types';

export const prismaRewardDirectory: RewardDirectory = {
  getInstallationStatus,
  findLinkedUsers: async actors => {
    const githubIds = actors.flatMap(actor =>
      'githubId' in actor ? [actor.githubId] : [],
    );
    const logins = actors.flatMap(actor =>
      'login' in actor ? [actor.login] : [],
    );

    const users = await prisma.githubUsers.findMany({
      where: {
        habiticaUser: { isNot: null },
        OR: [{ githubId: { in: githubIds } }, { login: { in: logins } }],
      },
      include: {
        habiticaUser: true,
        installation: { select: { installationId: true } },
        triggers: {
          include: {
            repositories: { select: { githubRepositoryId: true } },
          },
        },
      },
    });

    return users.flatMap(user =>
      user.habiticaUser
        ? [
            {
              id: user.id,
              githubId: user.githubId,
              login: user.login,
              installationId: user.installation.installationId,
              credentials: {
                userId: user.habiticaUser.userId,
                apiToken: user.habiticaUser.apiToken,
              },
              triggers: user.triggers.map(trigger => ({
                ...trigger,
                repositoryIds: trigger.repositories.map(
                  repository => repository.githubRepositoryId,
                ),
              })),
            },
          ]
        : [],
    );
  },
};
