'use server';

import { createTrigger } from '@/accessors/trigger';
import { parseInput, runUserAction } from '@/lib/userAction';
import { TriggerSchema, triggerSchema } from '@/schemas/triggerSchema';

export async function createTriggerAction(data: TriggerSchema) {
  return runUserAction('createTriggerAction', async githubUser => {
    const trigger = parseInput(triggerSchema, data);

    return createTrigger({
      githubUserId: githubUser.id,
      isActive: true,
      event: trigger.event,
      repositories: {
        connect: trigger.repositories.map(uuid => ({ uuid })),
      },
      taskTitle: trigger.taskTitle,
      taskAlias: trigger.taskAlias,
      taskNote: trigger.taskNote,
      taskPriority: trigger.taskPriority,
      taskAttribute: trigger.taskAttribute,
      taskFrequency: trigger.taskFrequency,
      scoreDirection: trigger.scoreDirection,
    });
  });
}
