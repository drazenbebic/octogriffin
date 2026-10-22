'use server';

import { getTriggers } from '@/accessors/trigger';
import { parseInput, runUserAction } from '@/lib/userAction';
import { paginationSchema } from '@/schemas/paginationSchema';
import type { PaginationParams } from '@/types/pagination';

export async function getTriggersAction(params?: PaginationParams) {
  return runUserAction('getTriggersAction', async githubUser =>
    getTriggers(githubUser.id, parseInput(paginationSchema, params)),
  );
}
