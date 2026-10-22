'use server';

import { upsertHabiticaUser } from '@/accessors/habiticaUser';
import HabiticaApi from '@/lib/HabiticaApi';
import logger from '@/lib/logger';
import { ActionError, parseInput, runUserAction } from '@/lib/userAction';
import {
  HabiticaUserSchema,
  habiticaUserSchema,
} from '@/schemas/habiticaUserSchema';

export async function upsertHabiticaUserAction(data: HabiticaUserSchema) {
  return runUserAction(
    'upsertHabiticaUserAction',
    async (githubUser): Promise<HabiticaUserSchema> => {
      const { userId, apiToken } = parseInput(habiticaUserSchema, data);

      try {
        await new HabiticaApi(userId, apiToken).getUserStats();
      } catch (error) {
        logger.error({ error }, 'Habitica API Error');

        throw new ActionError(
          'Invalid User ID or API Token. Please check your credentials.',
        );
      }

      const habiticaUser = await upsertHabiticaUser(
        githubUser.id,
        { userId, apiToken },
        { userId, apiToken },
      );

      return {
        userId: habiticaUser.userId,
        apiToken: habiticaUser.apiToken,
      };
    },
  );
}
