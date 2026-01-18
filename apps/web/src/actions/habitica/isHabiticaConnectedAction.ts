'use server';

import { getServerSession } from 'next-auth';

import { getGithubUserUserByLogin } from '@/accessors/githubUser';
import { authOptions } from '@/lib/auth';

export async function isHabiticaConnectedAction(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.name) {
      return false;
    }

    const user = await getGithubUserUserByLogin(session.user.name, {
      installation: true,
      habiticaUser: true,
    });

    if (!user) {
      return false;
    }

    // Criteria 1: Must have the GitHub App installed and active
    const hasActiveInstallation =
      !!user.installation && !user.installation.suspended;

    // Criteria 2: Must have linked Habitica credentials
    const hasHabiticaParams = !!user.habiticaUser;

    return hasActiveInstallation && hasHabiticaParams;
  } catch (error) {
    console.error('isHabiticaConnectedAction Error:', error);

    return false;
  }
}
