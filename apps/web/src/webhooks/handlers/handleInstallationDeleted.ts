import { deleteGithubInstallation } from '@/accessors/githubInstallation';
import logger from '@/lib/logger';
import type { WebhookEvent } from '@/webhooks/types';

export const handleInstallationDeleted = async ({
  payload: { installation },
}: WebhookEvent<'installation.deleted'>) => {
  logger.info('Event triggered.');

  // Errors fail the delivery, so it's retried. Otherwise data we promised to
  // delete would stay behind.
  const isDeleted = await deleteGithubInstallation(installation.id);

  if (!isDeleted) {
    logger.warn({ installationId: installation.id }, 'Installation not found.');

    return;
  }

  logger.info('Installation and all related data deleted successfully.');
};
