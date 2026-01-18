'use server';

import { getServerSession } from 'next-auth';

import { getGithubUserUserByLogin } from '@/accessors/githubUser';
import { getTrigger, updateTrigger } from '@/accessors/trigger';
import { TriggersModel } from '@/generated/prisma/models/Triggers';
import { authOptions } from '@/lib/auth';
import { TriggerSchema, triggerSchema } from '@/schemas/triggerSchema';
import { ServerActionResult } from '@/types/serverAction';

export async function updateTriggerAction(
  uuid: string,
  data: TriggerSchema,
): Promise<ServerActionResult<TriggersModel>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.name) {
      return { success: false, error: 'Unauthorized' };
    }

    const parsed = triggerSchema.safeParse(data);

    if (!parsed.success) {
      return { success: false, error: 'Invalid form data provided' };
    }

    const githubUser = await getGithubUserUserByLogin(session.user.name);

    if (!githubUser) {
      return { success: false, error: 'GitHub user account not found' };
    }

    const existingTrigger = await getTrigger(uuid, githubUser.id);

    if (!existingTrigger) {
      return {
        success: false,
        error: 'Trigger not found or you do not have permission to edit it.',
      };
    }

    const updatedTrigger = await updateTrigger(
      { id: existingTrigger.id },
      {
        event: parsed.data.event,
        repositories: {
          set: parsed.data.repositories.map(uuid => ({ uuid })),
        },
        taskTitle: parsed.data.taskTitle,
        taskAlias: parsed.data.taskAlias,
        taskNote: parsed.data.taskNote,
        taskPriority: parsed.data.taskPriority,
        taskAttribute: parsed.data.taskAttribute,
        taskFrequency: parsed.data.taskFrequency,
        scoreDirection: parsed.data.scoreDirection,
      },
    );

    if (!updatedTrigger) {
      return {
        success: false,
        error: 'Database error: Failed to update trigger.',
      };
    }

    return { success: true, data: updatedTrigger };
  } catch (error) {
    console.error('updateTriggerAction Error:', error);

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
