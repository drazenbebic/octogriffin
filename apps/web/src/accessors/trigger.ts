import type { Prisma } from '@/generated/prisma/client';
import type { TriggersModel } from '@/generated/prisma/models/Triggers';
import prisma from '@/lib/prisma';
import type { PaginatedResult, PaginationParams } from '@/types/pagination';

export const getTrigger = async (
  uuid: string,
  githubUserId: bigint | number,
) => {
  return prisma.triggers.findUnique({
    include: { repositories: true },
    where: { githubUserId, uuid },
  });
};

export const getTriggers = async (
  githubUserId: bigint | number,
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
      include: {
        repositories: true,
      },
      orderBy: { id: 'desc' },
      skip,
      take: limit,
      where: { githubUserId },
    }),
  ]);

  return {
    data,
    meta: {
      limit,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const deleteTrigger = async (
  uuid: string,
  githubUserId: bigint | number,
) => {
  return prisma.triggers.delete({
    where: { githubUserId, uuid },
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
    data,
    include: {
      repositories: true,
    },
    where,
  });
};
