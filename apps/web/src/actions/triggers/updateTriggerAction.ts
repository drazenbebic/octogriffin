'use server';

import { ownsRepositories } from '@/accessors/repository';
import { getTrigger, updateTrigger } from '@/accessors/trigger';
import { ActionError, parseInput, runUserAction } from '@/lib/userAction';
import type { TriggerSchema } from '@/schemas/triggerSchema';
import {
  triggerSchema,
  UNKNOWN_REPOSITORY_ERROR,
} from '@/schemas/triggerSchema';
import { toCooldownSeconds } from '@/utils/cooldown';

export async function updateTriggerAction(uuid: string, data: TriggerSchema) {
  return runUserAction('updateTriggerAction', async githubUser => {
    const trigger = parseInput(triggerSchema, data);
    const existingTrigger = await getTrigger(uuid, githubUser.id);

    if (!existingTrigger) {
      throw new ActionError(
        'Trigger not found or you do not have permission to edit it.',
      );
    }

    if (!(await ownsRepositories(githubUser.id, trigger.repositories))) {
      throw new ActionError(UNKNOWN_REPOSITORY_ERROR);
    }

    return updateTrigger(
      { id: existingTrigger.id },
      {
        cooldownSeconds: toCooldownSeconds(
          trigger.cooldownAmount,
          trigger.cooldownUnit,
        ),
        dailyCap: trigger.dailyCap ?? null,
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
