import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      /** Never changes, unlike the login in `name`. */
      githubId?: number;
    } & DefaultSession['user'];
  }
}
