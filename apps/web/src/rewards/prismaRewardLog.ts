import { createWebhookLog, deleteWebhookLog } from '@/accessors/webhookLog';
import { Prisma } from '@/generated/prisma/client';

import type { RewardLog } from './types';

const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

export const prismaRewardLog: RewardLog = {
  claim: async ({ delivery, name }, recipient) => {
    try {
      await createWebhookLog({
        deliveryUuid: delivery.id,
        event: name,
        githubUserId: recipient.githubUserId,
        hookId: delivery.hookId,
        signature: delivery.signature,
      });

      return true;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === UNIQUE_CONSTRAINT_VIOLATION
      ) {
        return false;
      }

      throw error;
    }
  },
  release: async ({ delivery }, recipient) => {
    await deleteWebhookLog(delivery.id, recipient.githubUserId);
  },
};
