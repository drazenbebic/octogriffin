import type { EmitterWebhookEvent } from '@octokit/webhooks';

import { getDelivery } from '@/app/api/v1/webhook/getDelivery';
import logger from '@/lib/logger';
import { deliverRewards } from '@/rewards/deliverRewards';
import { rewardDeps } from '@/rewards/rewardDeps';

export const handlePush = async ({
  id,
  payload: { commits, installation, repository },
}: EmitterWebhookEvent<'push'>) => {
  if (!installation?.id || !repository) {
    logger.info('Ignored: Missing installation or repository.');

    return;
  }

  // Count the commits of each author, skipping bots
  const commitCounts = new Map<string, number>();

  for (const { author } of commits) {
    if (!author.username || author.username.includes('[bot]')) {
      continue;
    }

    commitCounts.set(
      author.username,
      (commitCounts.get(author.username) ?? 0) + 1,
    );
  }

  await deliverRewards(
    {
      contributions: [...commitCounts].map(([login, count]) => ({
        actor: { login },
        count,
      })),
      delivery: getDelivery(id),
      installationId: installation.id,
      name: 'push',
      repositoryId: repository.id,
    },
    rewardDeps,
  );
};
