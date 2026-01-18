'use server';

import { getServerSession } from 'next-auth';

import { getGithubUserUserByLogin } from '@/accessors/githubUser';
import { authOptions } from '@/lib/auth';
import { UserCredentials } from '@/types/habitica';
import { ServerActionResult } from '@/types/serverAction';

export async function getHabiticaCredentialsAction(): Promise<
  ServerActionResult<UserCredentials>
> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.name) {
      return { success: false, error: 'Unauthorized' };
    }

    const user = await getGithubUserUserByLogin(session.user.name, {
      habiticaUser: true,
    });

    if (!user?.habiticaUser) {
      return { success: false, error: 'User is not connected to Habitica.' };
    }

    return {
      success: true,
      data: {
        userId: user.habiticaUser.userId,
        apiToken: user.habiticaUser.apiToken,
      },
    };
  } catch (error) {
    console.error('getHabiticaCredentialsAction Error:', error);

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
