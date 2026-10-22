'use server';

import { getTrigger, updateTrigger } from '@/accessors/trigger';
import { ActionError, parseInput, runUserAction } from '@/lib/userAction';
import type { ToggleTriggerSchema } from '@/schemas/toggleTriggerSchema';
import { toggleTriggerSchema } from '@/schemas/toggleTriggerSchema';

export async function toggleTriggerAction(data: ToggleTriggerSchema) {
  return runUserAction('toggleTriggerAction', async githubUser => {
    const { isActive, uuid } = parseInput(toggleTriggerSchema, data);
    const trigger = await getTrigger(uuid, githubUser.id);

    if (!trigger) {
      throw new ActionError('Trigger not found.');
    }

    return updateTrigger({ id: trigger.id }, { isActive });
  });
}
