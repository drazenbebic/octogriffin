'use server';

import { getServerSession } from 'next-auth';

import { getGithubUserUserByLogin } from '@/accessors/githubUser';
import { authOptions } from '@/lib/auth';

export type ConnectedRepository = {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  htmlUrl: string;
};

export async function getConnectedReposAction(): Promise<
  ConnectedRepository[]
> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.name) {
    return [];
  }

  const user = await getGithubUserUserByLogin(session.user.name, {
    installation: {
      include: {
        selectedRepositories: { orderBy: { createdAt: 'desc' } },
      },
    },
  });

  if (!user?.installation) {
    return [];
  }

  return user.installation.selectedRepositories.map(repository => ({
    id: repository.githubRepositoryId,
    name: repository.name,
    fullName: repository.fullName,
    private: repository.private,
    htmlUrl: `https://github.com/${repository.fullName}`,
  }));
}
