'use server';

import { getServerSession } from 'next-auth';

import { getGithubUserUserByLogin } from '@/accessors/githubUser';
import { upsertHabiticaUser } from '@/accessors/habiticaUser';
import { authOptions } from '@/lib/auth';
import HabiticaApi from '@/lib/HabiticaApi';
import {
  HabiticaUserSchema,
  habiticaUserSchema,
} from '@/schemas/habiticaUserSchema';
import { ServerActionResult } from '@/types/serverAction';

export async function upsertHabiticaUserAction(
  data: HabiticaUserSchema,
): Promise<ServerActionResult<HabiticaUserSchema>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.name) {
      return { success: false, error: 'Unauthorized' };
    }

    const parsed = habiticaUserSchema.safeParse(data);

    if (!parsed.success) {
      return { success: false, error: 'Invalid form data provided.' };
    }

    const githubUser = await getGithubUserUserByLogin(session.user.name);

    if (!githubUser) {
      return { success: false, error: 'GitHub user account not found.' };
    }

    const habitica = new HabiticaApi(parsed.data.userId, parsed.data.apiToken);

    let userStats;

    try {
      userStats = await habitica.getUserStats();
    } catch (error) {
      console.error('Habitica API Error:', error);
      return {
        success: false,
        error: 'Invalid User ID or API Token. Please check your credentials.',
      };
    }

    if (!userStats) {
      return {
        success: false,
        error: 'Invalid User ID or API Token. Please check your credentials.',
      };
    }

    const upsertedHabiticaUser = await upsertHabiticaUser(
      githubUser.id,
      {
        userId: parsed.data.userId,
        apiToken: parsed.data.apiToken,
      },
      {
        userId: parsed.data.userId,
        apiToken: parsed.data.apiToken,
      },
    );

    if (!upsertedHabiticaUser) {
      return {
        success: false,
        error: 'Database error: Failed to store credentials.',
      };
    }

    return {
      success: true,
      data: {
        userId: upsertedHabiticaUser.userId,
        apiToken: upsertedHabiticaUser.apiToken,
      },
    };
  } catch (error) {
    console.error('upsertHabiticaUserAction Error:', error);

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
