import type { EmitterWebhookEvent } from '@octokit/webhooks';

import { getDelivery } from '@/app/api/v1/webhook/getDelivery';
import logger from '@/lib/logger';
import { deliverRewards } from '@/rewards/deliverRewards';
import { rewardDeps } from '@/rewards/rewardDeps';
import { isEmptyCommit } from '@/utils/spam';

export const handlePush = async ({
  id,
  payload: { commits, installation, repository },
}: EmitterWebhookEvent<'push'>) => {
  if (!installation?.id || !repository) {
    logger.info('Ignored: Missing installation or repository.');

    return;
  }

  // Count the commits of each author, and how many are empty, skipping bots
  const commitCounts = new Map<string, { count: number; spamCount: number }>();

  for (const commit of commits) {
    const { author, distinct } = commit;

    // Commits pushed before, e.g. to another branch, were already rewarded
    if (!distinct) {
      continue;
    }

    if (!author.username || author.username.includes('[bot]')) {
      continue;
    }

    const counts = commitCounts.get(author.username) ?? {
      count: 0,
      spamCount: 0,
    };

    commitCounts.set(author.username, {
      count: counts.count + 1,
      spamCount: counts.spamCount + (isEmptyCommit(commit) ? 1 : 0),
    });
  }

  await deliverRewards(
    {
      contributions: [...commitCounts].map(([login, counts]) => ({
        actor: { login },
        ...counts,
      })),
      delivery: getDelivery(id),
      installationId: installation.id,
      name: 'push',
      repositoryId: repository.id,
    },
    rewardDeps,
  );
};
