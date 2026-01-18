import { EmitterWebhookEvent } from '@octokit/webhooks';

import {
  getGithubInstallation,
  initializeGithubInstallation,
} from '@/accessors/githubInstallation';
import logger from '@/lib/logger';

export const handleInstallationCreated = async ({
  payload: { installation, sender, repositories },
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

    logger.info(
      { count: repositories?.length || 0 },
      'Initial repositories added.',
    );
  } catch (error) {
    logger.error({ error }, 'Installation failed.');
  }

  logger.info({ installationId: installation.id }, 'Installation created.');
};
