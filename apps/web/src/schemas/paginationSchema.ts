import { z } from 'zod';

const MAX_LIMIT = 100;

export const paginationSchema = z
  .object({
    limit: z.number().int().min(1).max(MAX_LIMIT).optional(),
    page: z.number().int().min(1).optional(),
    search: z.string().optional(),
  })
  .optional();
