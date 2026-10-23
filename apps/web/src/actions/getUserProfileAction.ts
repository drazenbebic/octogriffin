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
      hasInstallation: githubUser.installations.some(
        installation => !installation.suspended,
      ),
      isLinked: !!githubUser.habiticaUser,
      joinedAt: githubUser.createdAt,
      location: githubUser.location,
      name: githubUser.name || githubUser.login,
      website: githubUser.blog,
    }),
    { habiticaUser: true, installations: true },
  );
}
