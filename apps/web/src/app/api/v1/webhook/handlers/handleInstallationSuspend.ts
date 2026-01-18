import { EmitterWebhookEvent } from '@octokit/webhooks';

import { updateGithubInstallation } from '@/accessors/githubInstallation';
import logger from '@/lib/logger';

export const handleInstallationSuspend = async ({
  payload: { installation },
}: EmitterWebhookEvent<'installation.suspend'>) => {
  logger.info('Event triggered.');

  try {
    await updateGithubInstallation(
      { installationId: installation.id },
      { suspended: true },
    );
  } catch (error) {
    logger.error({ error }, 'The installation could not be suspended.');
  }

  logger.info('Event processed.');
};
