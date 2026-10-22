'use server';

import { runUserAction } from '@/lib/userAction';

export async function isHabiticaConnectedAction() {
  return runUserAction(
    'isHabiticaConnectedAction',
    async githubUser =>
      // Must have the GitHub App installed and active, and linked Habitica credentials
      !githubUser.installation.suspended && !!githubUser.habiticaUser,
    { installation: true, habiticaUser: true },
  );
}
