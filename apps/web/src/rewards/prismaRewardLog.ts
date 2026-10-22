import { createWebhookLog } from '@/accessors/webhookLog';
import { Prisma } from '@/generated/prisma/client';

import { RewardLog } from './types';

const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

export const prismaRewardLog: RewardLog = {
  claim: async ({ delivery, name }, recipient) => {
    try {
      await createWebhookLog({
        deliveryUuid: delivery.id,
        event: name,
        signature: delivery.signature,
        hookId: delivery.hookId,
        githubUserId: recipient.githubUserId,
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
};
