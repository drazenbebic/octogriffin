import type { EmitterWebhookEvent } from '@octokit/webhooks';

import {
  getGithubInstallation,
  initializeGithubInstallation,
} from '@/accessors/githubInstallation';
import logger from '@/lib/logger';

export const handleInstallationCreated = async ({
  payload: { installation, repositories, sender },
}: EmitterWebhookEvent<'installation.created'>) => {
  logger.info({ installationId: installation.id }, 'Event triggered.');

  const existingGithubInstallation = await getGithubInstallation(
    installation.id,
  );

  if (existingGithubInstallation) {
    logger.info('Installation already exists, skipping.');

    return;
  }

  try {
    await initializeGithubInstallation(
      installation,
      sender,
      repositories || [],
    );
  } catch (error) {
    logger.error({ error }, 'Installation failed.');

    // Fail the delivery, so it's retried
    throw error;
  }

  logger.info(
    { count: repositories?.length || 0, installationId: installation.id },
    'Installation created.',
  );
};
