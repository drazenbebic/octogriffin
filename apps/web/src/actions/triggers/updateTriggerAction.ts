'use server';

import { getTrigger, updateTrigger } from '@/accessors/trigger';
import { ActionError, parseInput, runUserAction } from '@/lib/userAction';
import type { TriggerSchema } from '@/schemas/triggerSchema';
import { triggerSchema } from '@/schemas/triggerSchema';

export async function updateTriggerAction(uuid: string, data: TriggerSchema) {
  return runUserAction('updateTriggerAction', async githubUser => {
    const trigger = parseInput(triggerSchema, data);
    const existingTrigger = await getTrigger(uuid, githubUser.id);

    if (!existingTrigger) {
      throw new ActionError(
        'Trigger not found or you do not have permission to edit it.',
      );
    }

    return updateTrigger(
      { id: existingTrigger.id },
      {
        event: trigger.event,
        repositories: {
          set: trigger.repositories.map(repositoryUuid => ({
            uuid: repositoryUuid,
          })),
        },
        scoreDirection: trigger.scoreDirection,
        taskAlias: trigger.taskAlias,
        taskAttribute: trigger.taskAttribute,
        taskFrequency: trigger.taskFrequency,
        taskNote: trigger.taskNote,
        taskPriority: trigger.taskPriority,
        taskTitle: trigger.taskTitle,
      },
    );
  });
}
