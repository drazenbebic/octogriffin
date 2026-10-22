import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';

/**
 * Records a GitHub Marketplace event once. Returns `false` when the delivery
 * was already recorded, e.g. because it was retried.
 */
export const recordMarketplaceEvent = async (
  data: Prisma.MarketplaceEventsCreateInput,
) => {
  const { count } = await prisma.marketplaceEvents.createMany({
    data: [data],
    skipDuplicates: true,
  });

  return count > 0;
};
