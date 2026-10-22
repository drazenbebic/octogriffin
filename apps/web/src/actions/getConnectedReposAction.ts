'use server';

import { getAllRepositories } from '@/accessors/repository';
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
    async (githubUser): Promise<ConnectedRepository[]> => {
      const repositories = await getAllRepositories(githubUser.id);

      return repositories.map(repository => ({
        fullName: repository.fullName,
        htmlUrl: `https://github.com/${repository.fullName}`,
        id: repository.githubRepositoryId,
        name: repository.name,
        private: repository.private,
      }));
    },
  );
}
