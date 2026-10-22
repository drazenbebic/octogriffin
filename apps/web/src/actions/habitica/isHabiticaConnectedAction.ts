'use server';

import { runUserAction } from '@/lib/userAction';

export async function isHabiticaConnectedAction() {
  return runUserAction(
    'isHabiticaConnectedAction',
    githubUser =>
      // Must have the GitHub App installed and active, and linked Habitica credentials
      githubUser.installations.some(installation => !installation.suspended) &&
      !!githubUser.habiticaUser,
    { habiticaUser: true, installations: true },
  );
}
