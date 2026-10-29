import {
  addSelectedRepositories,
  getGithubInstallation,
} from '@/accessors/githubInstallation';
import logger from '@/lib/logger';
import type { WebhookEvent } from '@/webhooks/types';

export const handleInstallationRepositoriesAdded = async ({
  payload: { installation, repositories_added: repositoriesAdded },
}: WebhookEvent<'installation_repositories.added'>) => {
  logger.info({ installationId: installation.id }, 'Event triggered.');

  if (!repositoriesAdded || repositoriesAdded.length === 0) {
    return;
  }

  const existingInstallation = await getGithubInstallation(installation.id);

  if (!existingInstallation) {
    logger.warn({ installationId: installation.id }, 'Installation not found.');

    return;
  }

  // Errors fail the delivery, so it's retried
  await addSelectedRepositories(existingInstallation.id, repositoriesAdded);

  logger.info({ count: repositoriesAdded.length }, 'Repositories added.');
};
