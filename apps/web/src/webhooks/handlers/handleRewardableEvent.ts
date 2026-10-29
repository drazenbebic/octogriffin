import {
  addSelectedRepositories,
  getGithubInstallation,
  removeSelectedRepositories,
} from '@/accessors/githubInstallation';
import logger from '@/lib/logger';
import { deliverRewards } from '@/rewards/deliverRewards';
import { isQuickSelfClose } from '@/utils/spam';
import type { WebhookDeps, WebhookEvent } from '@/webhooks/types';
import type { RewardableEventName } from '@/webhooks/webhookEvents';

/**
 * Rewards every rewardable event but `push`, which has its own handler.
 */
export const handleRewardableEvent = async (
  {
    delivery,
    name: event,
    payload,
  }: WebhookEvent<Exclude<RewardableEventName, 'push'>>,
  { rewards }: WebhookDeps,
) => {
  const { installation, repository, sender } = payload;

  if (!installation || !repository || !sender) {
    logger.info('Ignored: Missing installation, repository, or sender.');

    return;
  }

  // An installation with access to all repositories may not get
  // installation_repositories events for repositories created or deleted later
  if (event === 'repository.created') {
    await updateSelectedRepositories(installation.id, githubInstallation =>
      addSelectedRepositories(githubInstallation, [repository]),
    );
  }

  await deliverRewards(
    {
      contributions: [
        {
          actor: { githubId: sender.id },
          count: 1,
          spamCount:
            event === 'pull_request.closed' &&
            'pull_request' in payload &&
            isQuickSelfClose(payload.pull_request, sender.id)
              ? 1
              : 0,
        },
      ],
      delivery,
      installationId: installation.id,
      name: event,
      repositoryId: repository.id,
    },
    rewards,
  );

  // Only after rewarding, which needs the repository to still be selected
  if (event === 'repository.deleted') {
    await updateSelectedRepositories(installation.id, githubInstallation =>
      removeSelectedRepositories(githubInstallation, [repository.id]),
    );
  }
};

const updateSelectedRepositories = async (
  installationId: number,
  update: (githubInstallationId: bigint) => Promise<unknown>,
) => {
  const githubInstallation = await getGithubInstallation(installationId);

  if (githubInstallation) {
    await update(githubInstallation.id);
  }
};
