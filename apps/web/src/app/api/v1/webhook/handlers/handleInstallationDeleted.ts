import { EmitterWebhookEvent } from '@octokit/webhooks';

import { deleteGithubInstallation } from '@/accessors/githubInstallation';
import logger from '@/lib/logger';

export const handleInstallationDeleted = async ({
  payload: { installation },
}: EmitterWebhookEvent<'installation.deleted'>) => {
  logger.info('Event triggered.');

  try {
    await deleteGithubInstallation(installation.id);

    logger.info('Installation and all related data deleted successfully.');
  } catch (error) {
    logger.error({ error }, 'Failed to delete installation.');
  }

  logger.info('Event processed.');
};
