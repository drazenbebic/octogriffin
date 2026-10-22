import type { NextAuthOptions } from 'next-auth';
import type { GithubProfile } from 'next-auth/providers/github';
import GithubProvider from 'next-auth/providers/github';
import { cookies } from 'next/headers';

import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ profile, token }) {
      const githubProfile = profile as GithubProfile;

      if (githubProfile) {
        token.username = githubProfile.login;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.username) {
        session.user.name = token.username as string;
      }

      return session;
    },
    async signIn({ account, profile }) {
      if (!account || !profile) {
        return false;
      }

      const githubProfile = profile as GithubProfile;
      const githubUser = await prisma.githubUsers.findFirst({
        where: { githubId: githubProfile.id },
      });

      if (!githubUser) {
        const cookieStore = await cookies();
        const callbackUrl =
          cookieStore.get('next-auth.callback-url')?.value ||
          cookieStore.get('__Secure-next-auth.callback-url')?.value ||
          '/';

        const separator = callbackUrl.includes('?') ? '&' : '?';

        return `${callbackUrl}${separator}error=GithubAppNotInstalled`;
      }

      await prisma.githubUsers.update({
        data: {
          accessToken: account.access_token,
          avatarUrl: githubProfile.avatar_url,
          blog: githubProfile.blog,
          company: githubProfile.company,
          email: githubProfile.email,
          expiresIn: account.expires_at,
          gravatarId: githubProfile.gravatar_id,
          htmlUrl: githubProfile.html_url,
          location: githubProfile.location,
          name: githubProfile.name,
          nodeId: githubProfile.node_id,
          scope: account.scope,
          tokenType: account.token_type,
          type: githubProfile.type,
        },
        where: { githubId: githubProfile.id },
      });

      return true;
    },
  },
  providers: [
    GithubProvider({
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
};
