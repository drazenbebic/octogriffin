'use server';

import { deleteTrigger, getTrigger } from '@/accessors/trigger';
import { ActionError, runUserAction } from '@/lib/userAction';

export async function deleteTriggerAction(triggerUuid: string) {
  return runUserAction('deleteTriggerAction', async githubUser => {
    const trigger = await getTrigger(triggerUuid, githubUser.id);

    if (!trigger) {
      throw new ActionError('Trigger not found.');
    }

    return deleteTrigger(triggerUuid, githubUser.id);
  });
}
