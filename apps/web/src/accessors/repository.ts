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

/**
 * Whether all the repositories belong to installations of the user.
 */
export const ownsRepositories = async (
  githubUserId: bigint | number,
  uuids: string[],
) => {
  const uniqueUuids = [...new Set(uuids)];

  const ownedCount = await prisma.githubSelectedRepositories.count({
    where: { installation: { githubUserId }, uuid: { in: uniqueUuids } },
  });

  return ownedCount === uniqueUuids.length;
};
