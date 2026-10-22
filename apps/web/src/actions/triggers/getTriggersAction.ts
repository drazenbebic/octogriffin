'use server';

import { getTriggers } from '@/accessors/trigger';
import { runUserAction } from '@/lib/userAction';
import type { PaginationParams } from '@/types/pagination';

export async function getTriggersAction(params?: PaginationParams) {
  return runUserAction('getTriggersAction', async githubUser =>
    getTriggers(githubUser.id, params),
  );
}
