'use server';

import { getServerSession } from 'next-auth';

import { getGithubUserUserByLogin } from '@/accessors/githubUser';
import { deleteTrigger, getTrigger } from '@/accessors/trigger';
import { TriggersModel } from '@/generated/prisma/models/Triggers';
import { authOptions } from '@/lib/auth';
import { ServerActionResult } from '@/types/serverAction';

export async function deleteTriggerAction(
  triggerUuid: string,
): Promise<ServerActionResult<TriggersModel>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.name) {
      return { success: false, error: 'Unauthorized' };
    }

    const githubUser = await getGithubUserUserByLogin(session.user.name);

    if (!githubUser) {
      return { success: false, error: 'GitHub user account not found.' };
    }

    const trigger = await getTrigger(triggerUuid, githubUser.id);

    if (!trigger) {
      return {
        success: false,
        error: 'Trigger not found.',
      };
    }

    const deletedTrigger = await deleteTrigger(triggerUuid, githubUser.id);

    if (!deletedTrigger) {
      return {
        success: false,
        error: 'Database error: Failed to delete trigger.',
      };
    }

    return { success: true, data: deletedTrigger };
  } catch (error) {
    console.error('deleteTriggerAction Error:', error);

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
