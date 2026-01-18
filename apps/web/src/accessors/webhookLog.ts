'use server';

import { Prisma } from '@/generated/prisma/client';
import { WebhookLogsModel } from '@/generated/prisma/models/WebhookLogs';
import prisma from '@/lib/prisma';
import { PaginatedResult, PaginationParams } from '@/types/pagination';

export const createWebhookLog = async (
  data: Prisma.WebhookLogsUncheckedCreateInput,
) => {
  return prisma.webhookLogs.create({ data });
};

export const getWebhookLogs = async (
  githubUserId: number | bigint,
  params: PaginationParams = {},
): Promise<PaginatedResult<WebhookLogsModel>> => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const [total, data] = await prisma.$transaction([
    prisma.webhookLogs.count({
      where: { githubUserId },
    }),
    prisma.webhookLogs.findMany({
      where: { githubUserId },
      orderBy: { id: 'desc' },
      skip,
      take: limit,
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
