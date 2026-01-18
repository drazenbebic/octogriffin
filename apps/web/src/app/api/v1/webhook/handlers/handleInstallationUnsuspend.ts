import { EmitterWebhookEvent } from '@octokit/webhooks';

import { updateGithubInstallation } from '@/accessors/githubInstallation';
import logger from '@/lib/logger';

export const handleInstallationUnsuspend = async ({
  payload: { installation },
}: EmitterWebhookEvent<'installation.unsuspend'>) => {
  logger.info('Event triggered.');

  try {
    await updateGithubInstallation(
      { installationId: installation.id },
      { suspended: false },
    );
  } catch (error) {
    logger.error({ error }, 'The installation could not be unsuspended.');
  }

  logger.info('Event processed.');
};
