'use server';

import { getServerSession } from 'next-auth';

import { getGithubUserUserByLogin } from '@/accessors/githubUser';
import { getAllRepositories } from '@/accessors/repository';
import { GithubSelectedRepositoriesModel } from '@/generated/prisma/models/GithubSelectedRepositories';
import { authOptions } from '@/lib/auth';
import { ServerActionResult } from '@/types/serverAction';

export async function getRepositoriesAction(): Promise<
  ServerActionResult<GithubSelectedRepositoriesModel[]>
> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.name) {
      return { success: false, error: 'Unauthorized' };
    }

    const githubUser = await getGithubUserUserByLogin(session.user.name, {
      installation: true,
    });

    if (!githubUser) {
      return { success: false, error: 'GitHub user account not found.' };
    }

    if (!githubUser.installation) {
      return { success: false, error: 'GitHub installation not found.' };
    }

    const repositories = await getAllRepositories(githubUser.installation.id);

    return { success: true, data: repositories };
  } catch (error) {
    console.error('getRepositoriesAction Error:', error);

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
