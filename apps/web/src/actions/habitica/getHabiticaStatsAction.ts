'use server';

import HabiticaApi from '@/lib/HabiticaApi';
import logger from '@/lib/logger';
import { ActionError, runUserAction } from '@/lib/userAction';
import type { UserStats } from '@/types/habitica';

export async function getHabiticaStatsAction() {
  return runUserAction(
    'getHabiticaStatsAction',
    async (githubUser): Promise<UserStats> => {
      if (!githubUser.habiticaUser) {
        throw new ActionError('User is not connected to Habitica.');
      }

      if (!githubUser.habiticaUser.apiToken) {
        throw new ActionError(
          'Your saved Habitica API Token could not be read. Please enter it again in Settings.',
        );
      }

      const habitica = new HabiticaApi(
        githubUser.habiticaUser.userId,
        githubUser.habiticaUser.apiToken,
      );

      let response;

      try {
        response = await habitica.getUserStats();
      } catch (error) {
        logger.error({ error }, 'Habitica API Error');

        throw new ActionError('Failed to retrieve stats from Habitica.');
      }

      if (!response?.stats) {
        throw new ActionError('Habitica API returned invalid data.');
      }

      return response.stats;
    },
    { habiticaUser: true },
  );
}
