'use server';

import { createTrigger } from '@/accessors/trigger';
import { parseInput, runUserAction } from '@/lib/userAction';
import type { TriggerSchema } from '@/schemas/triggerSchema';
import { triggerSchema } from '@/schemas/triggerSchema';

export async function createTriggerAction(data: TriggerSchema) {
  return runUserAction('createTriggerAction', async githubUser => {
    const trigger = parseInput(triggerSchema, data);

    return createTrigger({
      event: trigger.event,
      githubUserId: githubUser.id,
      isActive: true,
      repositories: {
        connect: trigger.repositories.map(uuid => ({ uuid })),
      },
      scoreDirection: trigger.scoreDirection,
      taskAlias: trigger.taskAlias,
      taskAttribute: trigger.taskAttribute,
      taskFrequency: trigger.taskFrequency,
      taskNote: trigger.taskNote,
      taskPriority: trigger.taskPriority,
      taskTitle: trigger.taskTitle,
    });
  });
}
