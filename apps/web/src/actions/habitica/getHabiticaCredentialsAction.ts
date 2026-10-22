'use server';

import { ActionError, runUserAction } from '@/lib/userAction';
import { UserCredentials } from '@/types/habitica';

export async function getHabiticaCredentialsAction() {
  return runUserAction(
    'getHabiticaCredentialsAction',
    async (githubUser): Promise<UserCredentials> => {
      if (!githubUser.habiticaUser) {
        throw new ActionError('User is not connected to Habitica.');
      }

      return {
        userId: githubUser.habiticaUser.userId,
        apiToken: githubUser.habiticaUser.apiToken,
      };
    },
    { habiticaUser: true },
  );
}
