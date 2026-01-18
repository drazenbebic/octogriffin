import {
  EmitterWebhookEvent,
  EmitterWebhookEventName,
} from '@octokit/webhooks';
import PQueue from 'p-queue';

import { getInstallationStatus } from '@/accessors/githubInstallation';
import { getLinkedGithubUser } from '@/accessors/githubUser';
import getHabiticaApi from '@/app/api/v1/webhook/getHabiticaApi';
import { universalHandlerWebhooks } from '@/app/api/v1/webhook/webhookConstants';
import {
  TaskAttribute,
  TaskDirection,
  TaskFrequency,
  TaskType,
} from '@/enums/habitica';
import logger from '@/lib/logger';

export type WebhookEventName = (typeof universalHandlerWebhooks)[number];

type WebhookEvent = EmitterWebhookEvent<WebhookEventName>;

export const handleUniversal = async (
  { payload: { installation, repository, sender } }: WebhookEvent,
  event: EmitterWebhookEventName,
) => {
  if (!installation || !repository || !sender) {
    logger.info('Ignored: Missing installation, repository, or sender.');
    return;
  }

  const githubInstallation = await getInstallationStatus(
    installation.id,
    repository.id,
  );

  if (!githubInstallation) {
    logger.info('Ignored: Installation not found.');
    return;
  }

  if (githubInstallation.isSuspended) {
    logger.info('Ignored: Installation is suspended.');
    return;
  }

  if (!githubInstallation.isRepositorySelected) {
    logger.info(
      { repositoryId: repository.id },
      'Ignored: Repository not whitelisted.',
    );
    return;
  }

  const githubUser = await getLinkedGithubUser(sender.id, event);

  if (!githubUser) {
    logger.warn(
      'Ignored: This user has no valid Habitica user or configured triggers.',
    );
    return;
  }

  const habiticaApi = await getHabiticaApi(installation.id, githubUser.login);

  if (!habiticaApi) {
    logger.error(
      { login: githubUser.login },
      'Habitica API initialization failed.',
    );
    return;
  }

  // Setup Queue
  const queue = new PQueue({ concurrency: 4 });

  // Add tasks to queue
  const queueTasks = githubUser.triggers.map(trigger => async () => {
    try {
      const task = await habiticaApi.findOrCreateTask({
        type: TaskType.HABIT,
        text: trigger.taskTitle,
        alias: trigger.taskAlias || undefined,
        notes: trigger.taskNote || undefined,
        priority: trigger.taskPriority,
        attribute: trigger.taskAttribute as TaskAttribute,
        frequency: trigger.taskFrequency as TaskFrequency,
      });

      const scoreDirection =
        trigger.scoreDirection === 'up' ? TaskDirection.UP : TaskDirection.DOWN;

      // Score the task
      await habiticaApi.scoreTask(task.id, scoreDirection);

      logger.info(
        {
          user: githubUser.login,
          task: trigger.taskTitle,
        },
        'Event processed successfully.',
      );
    } catch (error) {
      logger.error(
        { error, user: githubUser.login, trigger: trigger.uuid },
        'Failed to process trigger',
      );
    }
  });

  // Execute queue
  await queue.addAll(queueTasks);
};
