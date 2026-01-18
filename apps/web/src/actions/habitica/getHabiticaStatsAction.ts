'use server';

import { getServerSession } from 'next-auth';

import { getGithubUserUserByLogin } from '@/accessors/githubUser';
import { authOptions } from '@/lib/auth';
import HabiticaApi from '@/lib/HabiticaApi';
import { UserStats } from '@/types/habitica';
import { ServerActionResult } from '@/types/serverAction';

export async function getHabiticaStatsAction(): Promise<
  ServerActionResult<UserStats>
> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.name) {
      return { success: false, error: 'Unauthorized' };
    }

    const user = await getGithubUserUserByLogin(session.user.name, {
      habiticaUser: true,
    });

    if (!user?.habiticaUser?.userId || !user?.habiticaUser?.apiToken) {
      return { success: false, error: 'User is not connected to Habitica.' };
    }

    const habitica = new HabiticaApi(
      user.habiticaUser.userId,
      user.habiticaUser.apiToken,
    );

    let response;

    try {
      response = await habitica.getUserStats();

      if (!response || !response.stats) {
        return {
          success: false,
          error: 'Habitica API returned invalid data.',
        };
      }

      return { success: true, data: response.stats };
    } catch (error) {
      console.error('Habitica API Error:', error);

      return {
        success: false,
        error: 'Failed to retrieve stats from Habitica.',
      };
    }
  } catch (error) {
    console.error('getHabiticaStatsAction Error:', error);

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
