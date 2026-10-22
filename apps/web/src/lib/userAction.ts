import { getServerSession } from 'next-auth';

import type { z } from 'zod';

import { getGithubUserByGithubId } from '@/accessors/githubUser';
import type { Prisma } from '@/generated/prisma/client';
import { authOptions } from '@/lib/auth';
import logger from '@/lib/logger';
import type { ServerActionResult } from '@/types/serverAction';

/**
 * An expected failure. Its message is shown to the user as-is.
 */
export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ActionError';
  }
}

/**
 * Validates server action input, failing the action when it's invalid.
 */
export const parseInput = <T>(schema: z.ZodType<T>, input: unknown): T => {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    throw new ActionError('Invalid form data provided.');
  }

  return parsed.data;
};

/**
 * Runs a server action on behalf of the signed-in GitHub user.
 *
 * Takes care of authentication, resolving the user and shaping the result.
 * Throw an `ActionError` from the handler to fail with a message for the
 * user; anything else is logged and reported as an unexpected error.
 */
export const runUserAction = async <
  TData,
  TInclude extends Prisma.GithubUsersInclude = Record<string, never>,
>(
  name: string,
  handler: (
    githubUser: Prisma.GithubUsersGetPayload<{ include: TInclude }>,
  ) => Promise<TData> | TData,
  include?: TInclude,
): Promise<ServerActionResult<TData>> => {
  try {
    const session = await getServerSession(authOptions);

    // Logins can change and be taken over, the GitHub ID never does
    if (!session?.user?.githubId) {
      return { error: 'Unauthorized', success: false };
    }

    const githubUser = await getGithubUserByGithubId(
      session.user.githubId,
      include,
    );

    if (!githubUser) {
      return { error: 'GitHub user account not found.', success: false };
    }

    return { data: await handler(githubUser), success: true };
  } catch (error) {
    if (error instanceof ActionError) {
      return { error: error.message, success: false };
    }

    logger.error({ error }, `${name} failed.`);

    return {
      error: 'An unexpected error occurred. Please try again later.',
      success: false,
    };
  }
};
