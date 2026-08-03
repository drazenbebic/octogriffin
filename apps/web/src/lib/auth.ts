import { NextAuthOptions } from 'next-auth';
import GithubProvider, { GithubProfile } from 'next-auth/providers/github';
import { cookies } from 'next/headers';

import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async jwt({ token, profile }) {
      const githubProfile = profile as GithubProfile;

      if (githubProfile) {
        token.username = githubProfile.login;
      }

      return token;
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
        where: { githubId: githubProfile.id },
        data: {
          nodeId: githubProfile.node_id,
          avatarUrl: githubProfile.avatar_url,
          gravatarId: githubProfile.gravatar_id,
          htmlUrl: githubProfile.html_url,
          type: githubProfile.type,
          name: githubProfile.name,
          company: githubProfile.company,
          blog: githubProfile.blog,
          location: githubProfile.location,
          email: githubProfile.email,
          accessToken: account.access_token,
          expiresIn: account.expires_at,
          scope: account.scope,
          tokenType: account.token_type,
        },
      });

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.username) {
        session.user.name = token.username as string;
      }

      return session;
    },
  },
};
