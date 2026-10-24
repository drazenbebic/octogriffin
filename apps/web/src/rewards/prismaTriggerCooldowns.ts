import prisma from '@/lib/prisma';

import type { TriggerCooldowns } from './types';

export const prismaTriggerCooldowns: TriggerCooldowns = {
  // Only succeeds while nobody else has moved `lastScoredAt` since it was read
  claim: async (uuid, previousScoredAt, now) => {
    const { count } = await prisma.triggers.updateMany({
      data: { lastScoredAt: now },
      where: { lastScoredAt: previousScoredAt, uuid },
    });

    return count === 1;
  },
  release: async (uuid, claimedAt, previousScoredAt) => {
    await prisma.triggers.updateMany({
      data: { lastScoredAt: previousScoredAt },
      where: { lastScoredAt: claimedAt, uuid },
    });
  },
};
