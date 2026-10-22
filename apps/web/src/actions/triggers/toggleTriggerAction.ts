'use server';

import { getTrigger, updateTrigger } from '@/accessors/trigger';
import { ActionError, parseInput, runUserAction } from '@/lib/userAction';
import {
  ToggleTriggerSchema,
  toggleTriggerSchema,
} from '@/schemas/toggleTriggerSchema';

export async function toggleTriggerAction(data: ToggleTriggerSchema) {
  return runUserAction('toggleTriggerAction', async githubUser => {
    const { uuid, isActive } = parseInput(toggleTriggerSchema, data);
    const trigger = await getTrigger(uuid, githubUser.id);

    if (!trigger) {
      throw new ActionError('Trigger not found.');
    }

    return updateTrigger({ id: trigger.id }, { isActive });
  });
}
