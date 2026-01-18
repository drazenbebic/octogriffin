'use server';

import { getGithubInstallation } from '@/accessors/githubInstallation';
import { getGithubUser } from '@/accessors/githubUser';
import { getHabiticaUser } from '@/accessors/habiticaUser';
import HabiticaApi from '@/lib/HabiticaApi';

const getHabiticaApi = async (
  installationId: number,
  login: string,
): Promise<HabiticaApi | null> => {
  const gitHubInstallation = await getGithubInstallation(installationId);

  if (!gitHubInstallation) {
    return null;
  }

  const githubUser = await getGithubUser({
    installationId: gitHubInstallation.id,
    login,
  });

  if (!githubUser) {
    return null;
  }

  const habiticaUser = await getHabiticaUser(githubUser.id);

  if (!habiticaUser) {
    return null;
  }

  if (!habiticaUser?.userId || !habiticaUser?.apiToken) {
    console.error(
      'Habitica user is missing user_id or api_token',
      habiticaUser,
    );
  }

  return new HabiticaApi(habiticaUser.userId, habiticaUser.apiToken);
};

export default getHabiticaApi;
