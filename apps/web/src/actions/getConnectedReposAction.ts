'use server';

import { runUserAction } from '@/lib/userAction';

export type ConnectedRepository = {
  fullName: string;
  htmlUrl: string;
  id: number;
  name: string;
  private: boolean;
};

export async function getConnectedReposAction() {
  return runUserAction(
    'getConnectedReposAction',
    async (githubUser): Promise<ConnectedRepository[]> =>
      githubUser.installation.selectedRepositories.map(repository => ({
        fullName: repository.fullName,
        htmlUrl: `https://github.com/${repository.fullName}`,
        id: repository.githubRepositoryId,
        name: repository.name,
        private: repository.private,
      })),
    {
      installation: {
        include: {
          selectedRepositories: { orderBy: { createdAt: 'desc' } },
        },
      },
    },
  );
}
