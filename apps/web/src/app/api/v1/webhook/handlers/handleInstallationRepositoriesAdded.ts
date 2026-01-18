import { EmitterWebhookEvent } from '@octokit/webhooks';

import {
  addSelectedRepositories,
  getGithubInstallation,
} from '@/accessors/githubInstallation';
import logger from '@/lib/logger';

export const handleInstallationRepositoriesAdded = async ({
  payload: { installation, repositories_added: repositoriesAdded },
}: EmitterWebhookEvent<'installation_repositories.added'>) => {
  logger.info({ installationId: installation.id }, 'Event triggered.');

  if (!repositoriesAdded || repositoriesAdded.length === 0) {
    return;
  }

  const existingInstallation = await getGithubInstallation(installation.id);

  if (!existingInstallation) {
    logger.warn({ installationId: installation.id }, 'Installation not found.');
    return;
  }

  try {
    await addSelectedRepositories(existingInstallation.id, repositoriesAdded);
  } catch (error) {
    logger.error({ error }, 'Repositories could not be added.');
  }

  logger.info({ count: repositoriesAdded.length }, 'Repositories added.');
};
