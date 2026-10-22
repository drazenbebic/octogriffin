'use server';

import { runUserAction } from '@/lib/userAction';

export async function getUserProfileAction() {
  return runUserAction(
    'getUserProfileAction',
    async githubUser => ({
      name: githubUser.name || githubUser.login,
      handle: githubUser.login,
      avatar: githubUser.avatarUrl,
      location: githubUser.location,
      company: githubUser.company,
      website: githubUser.blog,
      email: githubUser.email,
      joinedAt: githubUser.id,
      isLinked: !!githubUser.habiticaUser,
      hasInstallation: !githubUser.installation.suspended,
      githubUrl: githubUser.htmlUrl,
    }),
    { habiticaUser: true, installation: true },
  );
}
