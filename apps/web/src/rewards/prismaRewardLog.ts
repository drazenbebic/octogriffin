import { createWebhookLog } from '@/accessors/webhookLog';
import logger from '@/lib/logger';

import { RewardLog } from './types';

export const prismaRewardLog: RewardLog = {
  record: async ({ delivery, name }, recipient) => {
    try {
      await createWebhookLog({
        deliveryUuid: delivery.id,
        event: name,
        signature: delivery.signature,
        hookId: delivery.hookId,
        githubUserId: recipient.githubUserId,
      });
    } catch (error) {
      logger.error({ error }, 'Webhook logging failed.');
    }
  },
};
