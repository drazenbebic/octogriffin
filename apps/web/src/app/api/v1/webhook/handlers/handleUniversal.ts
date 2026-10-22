import {
  EmitterWebhookEvent,
  EmitterWebhookEventName,
} from '@octokit/webhooks';

import { universalHandlerWebhooks } from '@/app/api/v1/webhook/webhookConstants';
import logger from '@/lib/logger';
import { deliverRewards } from '@/rewards/deliverRewards';
import { rewardDeps } from '@/rewards/rewardDeps';

export type WebhookEventName = (typeof universalHandlerWebhooks)[number];

type WebhookEvent = EmitterWebhookEvent<WebhookEventName>;

export const handleUniversal = async (
  { payload: { installation, repository, sender } }: WebhookEvent,
  event: EmitterWebhookEventName,
) => {
  if (!installation || !repository || !sender) {
    logger.info('Ignored: Missing installation, repository, or sender.');

    return;
  }

  await deliverRewards(
    {
      name: event,
      installationId: installation.id,
      repositoryId: repository.id,
      contributions: [{ actor: { githubId: sender.id }, count: 1 }],
    },
    rewardDeps,
  );
};
