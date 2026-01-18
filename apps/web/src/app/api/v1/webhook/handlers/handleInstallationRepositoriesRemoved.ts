import { EmitterWebhookEvent } from '@octokit/webhooks';

import {
  getGithubInstallation,
  removeSelectedRepositories,
} from '@/accessors/githubInstallation';
import logger from '@/lib/logger';

export const handleInstallationRepositoriesRemoved = async ({
  payload: { installation, repositories_removed: repositoriesRemoved },
}: EmitterWebhookEvent<'installation_repositories.removed'>) => {
  if (!repositoriesRemoved || repositoriesRemoved.length === 0) {
    return;
  }

  const existingInstallation = await getGithubInstallation(installation.id);

  if (!existingInstallation) {
    logger.warn({ installationId: installation.id }, 'Installation not found.');
    return;
  }

  await removeSelectedRepositories(
    existingInstallation.id,
    repositoriesRemoved.map(({ id }) => id),
  );

  logger.info({ count: repositoriesRemoved.length }, 'Repositories removed.');
};
