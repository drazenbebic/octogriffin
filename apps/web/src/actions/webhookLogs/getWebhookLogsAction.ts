'use server';

import { getServerSession } from 'next-auth';

import { getGithubUserUserByLogin } from '@/accessors/githubUser';
import { getWebhookLogs } from '@/accessors/webhookLog';
import { WebhookLogsModel } from '@/generated/prisma/models/WebhookLogs';
import { authOptions } from '@/lib/auth';
import { PaginatedResult, PaginationParams } from '@/types/pagination';
import { ServerActionResult } from '@/types/serverAction';

export async function getWebhookLogsAction(
  params?: PaginationParams,
): Promise<ServerActionResult<PaginatedResult<WebhookLogsModel>>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.name) {
      return { success: false, error: 'Unauthorized' };
    }

    const githubUser = await getGithubUserUserByLogin(session.user.name);

    if (!githubUser) {
      return { success: false, error: 'GitHub user account not found.' };
    }

    const webhookLogs = await getWebhookLogs(githubUser.id, params);

    return { success: true, data: webhookLogs };
  } catch (error) {
    console.error('getWebhookLogsAction Error:', error);

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
