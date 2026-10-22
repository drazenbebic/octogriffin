'use server';

import { upsertHabiticaUser } from '@/accessors/habiticaUser';
import HabiticaApi from '@/lib/HabiticaApi';
import logger from '@/lib/logger';
import { ActionError, parseInput, runUserAction } from '@/lib/userAction';
import {
  HabiticaUserSchema,
  habiticaUserSchema,
} from '@/schemas/habiticaUserSchema';
import { HabiticaAccount } from '@/types/habitica';

export async function upsertHabiticaUserAction(data: HabiticaUserSchema) {
  return runUserAction(
    'upsertHabiticaUserAction',
    async (githubUser): Promise<HabiticaAccount> => {
      const input = parseInput(habiticaUserSchema, data);
      const apiToken = input.apiToken || githubUser.habiticaUser?.apiToken;

      if (!apiToken) {
        throw new ActionError('Please enter your Habitica API Token.');
      }

      try {
        await new HabiticaApi(input.userId, apiToken).getUserStats();
      } catch (error) {
        logger.error({ error }, 'Habitica API Error');

        throw new ActionError(
          'Invalid User ID or API Token. Please check your credentials.',
        );
      }

      const habiticaUser = await upsertHabiticaUser(
        githubUser.id,
        { userId: input.userId, apiToken },
        { userId: input.userId, apiToken },
      );

      return { userId: habiticaUser.userId };
    },
    { habiticaUser: true },
  );
}
