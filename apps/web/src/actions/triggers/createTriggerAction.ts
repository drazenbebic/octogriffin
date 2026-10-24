'use server';

import { ownsRepositories } from '@/accessors/repository';
import { createTrigger } from '@/accessors/trigger';
import { ActionError, parseInput, runUserAction } from '@/lib/userAction';
import type { TriggerSchema } from '@/schemas/triggerSchema';
import {
  triggerSchema,
  UNKNOWN_REPOSITORY_ERROR,
} from '@/schemas/triggerSchema';
import { toCooldownSeconds } from '@/utils/cooldown';

export async function createTriggerAction(data: TriggerSchema) {
  return runUserAction('createTriggerAction', async githubUser => {
    const trigger = parseInput(triggerSchema, data);

    if (!(await ownsRepositories(githubUser.id, trigger.repositories))) {
      throw new ActionError(UNKNOWN_REPOSITORY_ERROR);
    }

    return createTrigger({
      cooldownSeconds: toCooldownSeconds(
        trigger.cooldownAmount,
        trigger.cooldownUnit,
      ),
      dailyCap: trigger.dailyCap ?? null,
      event: trigger.event,
      githubUserId: githubUser.id,
      isActive: true,
      repositories: {
        connect: trigger.repositories.map(uuid => ({ uuid })),
      },
      scoreDirection: trigger.scoreDirection,
      skipSpam: trigger.skipSpam ?? true,
      taskAlias: trigger.taskAlias,
      taskAttribute: trigger.taskAttribute,
      taskFrequency: trigger.taskFrequency,
      taskNote: trigger.taskNote,
      taskPriority: trigger.taskPriority,
      taskTitle: trigger.taskTitle,
    });
  });
}
