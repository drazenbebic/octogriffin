import { setGithubInstallationSuspended } from '@/accessors/githubInstallation';
import logger from '@/lib/logger';
import type { WebhookEvent } from '@/webhooks/types';

export const handleInstallationSuspend = async ({
  payload: { installation },
}: WebhookEvent<'installation.suspend'>) => {
  logger.info('Event triggered.');

  // Errors fail the delivery, so it's retried
  const isUpdated = await setGithubInstallationSuspended(installation.id, true);

  if (!isUpdated) {
    logger.warn({ installationId: installation.id }, 'Installation not found.');

    return;
  }

  logger.info('Installation suspended.');
};
