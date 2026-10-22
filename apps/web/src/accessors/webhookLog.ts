import type { Prisma } from '@/generated/prisma/client';
import type { WebhookLogsModel } from '@/generated/prisma/models/WebhookLogs';
import prisma from '@/lib/prisma';
import type { PaginatedResult, PaginationParams } from '@/types/pagination';

export const createWebhookLog = async (
  data: Prisma.WebhookLogsUncheckedCreateInput,
) => {
  return prisma.webhookLogs.create({ data });
};

export const deleteWebhookLog = async (
  deliveryUuid: string,
  githubUserId: bigint | number,
) => {
  return prisma.webhookLogs.deleteMany({
    where: { deliveryUuid, githubUserId },
  });
};

export const getWebhookLogs = async (
  githubUserId: bigint | number,
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
