import { Prisma } from '@/generated/prisma/client';

export type TriggerWithRepos = Prisma.TriggersGetPayload<{
  include: { repositories: true };
}>;
