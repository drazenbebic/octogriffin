'use server';

import { getServerSession } from 'next-auth';

import { getGithubUserUserByLogin } from '@/accessors/githubUser';
import { getTrigger, updateTrigger } from '@/accessors/trigger';
import { TriggersModel } from '@/generated/prisma/models/Triggers';
import { authOptions } from '@/lib/auth';
import {
  ToggleTriggerSchema,
  toggleTriggerSchema,
} from '@/schemas/toggleTriggerSchema';
import { ServerActionResult } from '@/types/serverAction';

export async function toggleTriggerAction(
  data: ToggleTriggerSchema,
): Promise<ServerActionResult<TriggersModel>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.name) {
      return { success: false, error: 'Unauthorized' };
    }

    const parsed = toggleTriggerSchema.safeParse(data);

    if (!parsed.success) {
      return { success: false, error: 'Invalid form data provided.' };
    }

    const githubUser = await getGithubUserUserByLogin(session.user.name);

    if (!githubUser) {
      return { success: false, error: 'GitHub user account not found.' };
    }

    const existingTrigger = await getTrigger(parsed.data.uuid, githubUser.id);

    if (!existingTrigger) {
      return {
        success: false,
        error: 'Trigger not found.',
      };
    }

    const updatedTrigger = await updateTrigger(
      { uuid: parsed.data.uuid },
      { isActive: parsed.data.isActive },
    );

    if (!updatedTrigger) {
      return {
        success: false,
        error: 'Database error: Failed to update status.',
      };
    }

    return { success: true, data: updatedTrigger };
  } catch (error) {
    console.error('toggleTriggerAction Error:', error);

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
