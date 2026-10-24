import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';

export const upsertHabiticaUser = (
  githubUserId: bigint | number,
  createData: Omit<Prisma.HabiticaUsersUncheckedCreateInput, 'githubUserId'>,
  updateData: Prisma.HabiticaUsersUncheckedUpdateInput,
) => {
  return prisma.habiticaUsers.upsert({
    create: {
      ...createData,
      githubUserId,
    },
    update: updateData,
    where: {
      githubUserId,
    },
  });
};
