'use server';

import { ActionError, runUserAction } from '@/lib/userAction';
import type { HabiticaAccount } from '@/types/habitica';

export async function getHabiticaCredentialsAction() {
  return runUserAction(
    'getHabiticaCredentialsAction',
    async (githubUser): Promise<HabiticaAccount> => {
      if (!githubUser.habiticaUser) {
        throw new ActionError('User is not connected to Habitica.');
      }

      return { userId: githubUser.habiticaUser.userId };
    },
    { habiticaUser: true },
  );
}
