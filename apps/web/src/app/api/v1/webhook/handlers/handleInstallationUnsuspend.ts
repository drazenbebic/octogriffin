import type { EmitterWebhookEvent } from '@octokit/webhooks';

import { setGithubInstallationSuspended } from '@/accessors/githubInstallation';
import logger from '@/lib/logger';

export const handleInstallationUnsuspend = async ({
  payload: { installation },
}: EmitterWebhookEvent<'installation.unsuspend'>) => {
  logger.info('Event triggered.');

  // Errors fail the delivery, so it's retried
  const isUpdated = await setGithubInstallationSuspended(
    installation.id,
    false,
  );

  if (!isUpdated) {
    logger.warn({ installationId: installation.id }, 'Installation not found.');

    return;
  }

  logger.info('Installation unsuspended.');
};
