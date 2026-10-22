import { EmitterWebhookEvent } from '@octokit/webhooks';

import logger from '@/lib/logger';
import { deliverRewards } from '@/rewards/deliverRewards';
import { rewardDeps } from '@/rewards/rewardDeps';

export const handlePush = async ({
  payload: { commits, repository, installation },
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
      name: 'push',
      installationId: installation.id,
      repositoryId: repository.id,
      contributions: [...commitCounts].map(([login, count]) => ({
        actor: { login },
        count,
      })),
    },
    rewardDeps,
  );
};
