'use server';

import { upsertHabiticaUser } from '@/accessors/habiticaUser';
import { Prisma } from '@/generated/prisma/client';
import HabiticaApi from '@/lib/HabiticaApi';
import logger from '@/lib/logger';
import { ActionError, parseInput, runUserAction } from '@/lib/userAction';
import type { HabiticaUserSchema } from '@/schemas/habiticaUserSchema';
import { habiticaUserSchema } from '@/schemas/habiticaUserSchema';
import type { HabiticaAccount } from '@/types/habitica';

const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

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

      let habiticaUser;

      try {
        habiticaUser = await upsertHabiticaUser(
          githubUser.id,
          { apiToken, userId: input.userId },
          { apiToken, userId: input.userId },
        );
      } catch (error) {
        // Each Habitica account can only be linked once
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === UNIQUE_CONSTRAINT_VIOLATION
        ) {
          throw new ActionError(
            'This Habitica account is already linked to another GitHub account.',
          );
        }

        throw error;
      }

      return { hasApiToken: true, userId: habiticaUser.userId };
    },
    { habiticaUser: true },
  );
}
