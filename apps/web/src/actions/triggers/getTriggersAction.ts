'use server';

import { getServerSession } from 'next-auth';

import { getGithubUserUserByLogin } from '@/accessors/githubUser';
import { getTriggers } from '@/accessors/trigger';
import { TriggersModel } from '@/generated/prisma/models/Triggers';
import { authOptions } from '@/lib/auth';
import { PaginatedResult, PaginationParams } from '@/types/pagination';
import { ServerActionResult } from '@/types/serverAction';

export async function getTriggersAction(
  params?: PaginationParams,
): Promise<ServerActionResult<PaginatedResult<TriggersModel>>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.name) {
      return { success: false, error: 'Unauthorized' };
    }

    const githubUser = await getGithubUserUserByLogin(session.user.name);

    if (!githubUser) {
      return { success: false, error: 'GitHub user account not found.' };
    }

    const triggers = await getTriggers(githubUser.id, params);

    return { success: true, data: triggers };
  } catch (error) {
    console.error('getTriggersAction Error:', error);

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
