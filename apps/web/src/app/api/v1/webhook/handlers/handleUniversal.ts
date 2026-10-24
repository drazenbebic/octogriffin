import type {
  EmitterWebhookEvent,
  EmitterWebhookEventName,
} from '@octokit/webhooks';

import {
  addSelectedRepositories,
  getGithubInstallation,
  removeSelectedRepositories,
} from '@/accessors/githubInstallation';
import { getDelivery } from '@/app/api/v1/webhook/getDelivery';
import type { universalHandlerWebhooks } from '@/app/api/v1/webhook/webhookConstants';
import logger from '@/lib/logger';
import { deliverRewards } from '@/rewards/deliverRewards';
import { rewardDeps } from '@/rewards/rewardDeps';
import { isQuickSelfClose } from '@/utils/spam';

export type WebhookEventName = (typeof universalHandlerWebhooks)[number];

type WebhookEvent = EmitterWebhookEvent<WebhookEventName>;

export const handleUniversal = async (
  { id, payload }: WebhookEvent,
  event: EmitterWebhookEventName,
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
      delivery: getDelivery(id),
      installationId: installation.id,
      name: event,
      repositoryId: repository.id,
    },
    rewardDeps,
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
