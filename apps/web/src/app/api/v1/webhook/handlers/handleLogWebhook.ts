import { EmitterWebhookEvent } from '@octokit/webhooks';

import { createWebhookLog } from '@/accessors/webhookLog';
import { GithubUsersModel } from '@/generated/prisma/models/GithubUsers';
import { getRequestContext } from '@/lib/context';
import logger from '@/lib/logger';

export const handleLogWebhook = async (
  { id, name }: EmitterWebhookEvent,
  githubUser: GithubUsersModel,
) => {
  logger.info('Logging webhook.');

  const ctx = getRequestContext();

  if (!ctx) {
    logger.error('Webhook context lost. Cannot log event.');

    return;
  }

  const { signature, hookId } = ctx;

  try {
    await createWebhookLog({
      deliveryUuid: id,
      event: name,
      signature,
      hookId,
      githubUserId: githubUser.id,
    });
  } catch (error) {
    logger.error({ error }, 'Webhook logging failed.');

    return;
  }

  logger.info('Webhook logged.');
};
