import prisma from '@/lib/prisma';

/**
 * The repositories of all installations of a user.
 */
export const getAllRepositories = (githubUserId: bigint | number) => {
  return prisma.githubSelectedRepositories.findMany({
    orderBy: { createdAt: 'desc' },
    where: { installation: { githubUserId } },
  });
};
