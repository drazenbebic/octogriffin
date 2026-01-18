'use server';

import { Prisma } from '@/generated/prisma/client';
import { TriggersModel } from '@/generated/prisma/models/Triggers';
import prisma from '@/lib/prisma';
import { PaginatedResult, PaginationParams } from '@/types/pagination';

export const getTrigger = async (
  uuid: string,
  githubUserId: number | bigint,
) => {
  return prisma.triggers.findUnique({
    where: { uuid, githubUserId },
    include: { repositories: true },
  });
};

export const getTriggers = async (
  githubUserId: number | bigint,
  params: PaginationParams = {},
): Promise<PaginatedResult<TriggersModel>> => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const [total, data] = await prisma.$transaction([
    prisma.triggers.count({
      where: { githubUserId },
    }),
    prisma.triggers.findMany({
      where: { githubUserId },
      orderBy: { id: 'desc' },
      skip,
      take: limit,
      include: {
        repositories: true,
      },
    }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const deleteTrigger = async (
  uuid: string,
  githubUserId: number | bigint,
) => {
  return prisma.triggers.delete({
    where: { uuid, githubUserId },
  });
};

export const createTrigger = async (
  data: Prisma.TriggersUncheckedCreateInput,
) => {
  return prisma.triggers.create({ data, include: { repositories: true } });
};

export const updateTrigger = async (
  where: Prisma.TriggersWhereUniqueInput,
  data: Prisma.TriggersUncheckedUpdateInput,
) => {
  return prisma.triggers.update({
    where,
    data,
    include: {
      repositories: true,
    },
  });
};
