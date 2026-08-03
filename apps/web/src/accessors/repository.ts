import prisma from '@/lib/prisma';

export const getAllRepositories = (installationId: bigint | number) => {
  return prisma.githubSelectedRepositories.findMany({
    where: { installationId },
  });
};
