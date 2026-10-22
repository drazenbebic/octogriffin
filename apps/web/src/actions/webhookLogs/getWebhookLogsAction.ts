'use server';

import { getWebhookLogs } from '@/accessors/webhookLog';
import { parseInput, runUserAction } from '@/lib/userAction';
import { paginationSchema } from '@/schemas/paginationSchema';
import type { PaginationParams } from '@/types/pagination';

export async function getWebhookLogsAction(params?: PaginationParams) {
  return runUserAction('getWebhookLogsAction', async githubUser =>
    getWebhookLogs(githubUser.id, parseInput(paginationSchema, params)),
  );
}
