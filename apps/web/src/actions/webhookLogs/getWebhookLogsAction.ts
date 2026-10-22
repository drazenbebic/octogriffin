'use server';

import { getWebhookLogs } from '@/accessors/webhookLog';
import { runUserAction } from '@/lib/userAction';
import type { PaginationParams } from '@/types/pagination';

export async function getWebhookLogsAction(params?: PaginationParams) {
  return runUserAction('getWebhookLogsAction', async githubUser =>
    getWebhookLogs(githubUser.id, params),
  );
}
