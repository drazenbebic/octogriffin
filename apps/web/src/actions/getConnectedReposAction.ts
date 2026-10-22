'use server';

import { runUserAction } from '@/lib/userAction';

export type ConnectedRepository = {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  htmlUrl: string;
};

export async function getConnectedReposAction() {
  return runUserAction(
    'getConnectedReposAction',
    async (githubUser): Promise<ConnectedRepository[]> =>
      githubUser.installation.selectedRepositories.map(repository => ({
        id: repository.githubRepositoryId,
        name: repository.name,
        fullName: repository.fullName,
        private: repository.private,
        htmlUrl: `https://github.com/${repository.fullName}`,
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
