'use server';

import { runUserAction } from '@/lib/userAction';

export async function getUserProfileAction() {
  return runUserAction(
    'getUserProfileAction',
    githubUser => ({
      avatar: githubUser.avatarUrl,
      company: githubUser.company,
      email: githubUser.email,
      githubUrl: githubUser.htmlUrl,
      handle: githubUser.login,
      hasInstallation: !githubUser.installation.suspended,
      isLinked: !!githubUser.habiticaUser,
      joinedAt: githubUser.id,
      location: githubUser.location,
      name: githubUser.name || githubUser.login,
      website: githubUser.blog,
    }),
    { habiticaUser: true, installation: true },
  );
}
