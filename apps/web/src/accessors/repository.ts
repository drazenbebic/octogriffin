import prisma from '@/lib/prisma';

export const getAllRepositories = (installationId: number | bigint) => {
  return prisma.githubSelectedRepositories.findMany({
    where: { installationId },
  });
};
