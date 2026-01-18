import { EmitterWebhookEvent } from '@octokit/webhooks';

import { getGithubUserBySenderId } from '@/accessors/githubUser';
import { createWebhookLog } from '@/accessors/webhookLog';
import { getRequestContext } from '@/lib/context';
import logger from '@/lib/logger';

export const handleLogWebhook = async ({
  id,
  name,
  payload,
}: EmitterWebhookEvent) => {
  logger.info('Logging webhook.');

  const ctx = getRequestContext();

  if (!ctx) {
    logger.error('Webhook context lost. Cannot log event.');
    return;
  }

  if (!payload.sender?.id) {
    logger.error('Sender could not be identified. Cannot log event.');
    return;
  }

  const githubUser = await getGithubUserBySenderId(payload.sender.id);

  if (!githubUser) {
    logger.error('Sender could not be identified. Cannot log event.');
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
      // @ts-expect-error Just a type mismatch
      payload,
    });
  } catch (error) {
    logger.error({ error }, 'Webhook logging failed.');
    return;
  }

  logger.info('Webhook logged.');
};
