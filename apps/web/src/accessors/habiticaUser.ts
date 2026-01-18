'use server';

import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';

export const upsertHabiticaUser = async (
  githubUserId: bigint | number,
  createData: Omit<Prisma.HabiticaUsersUncheckedCreateInput, 'githubUserId'>,
  updateData: Prisma.HabiticaUsersUncheckedUpdateInput,
) => {
  return prisma.habiticaUsers.upsert({
    where: {
      githubUserId,
    },
    create: {
      ...createData,
      githubUserId,
    },
    update: updateData,
  });
};

export const getHabiticaUser = async (githubUserId: number | bigint) => {
  return prisma.habiticaUsers.findFirst({
    where: { githubUserId },
  });
};
