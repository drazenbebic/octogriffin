import { EmitterWebhookEvent } from '@octokit/webhooks';
import PQueue from 'p-queue';

import { getInstallationStatus } from '@/accessors/githubInstallation';
import { getLinkedGithubUsers } from '@/accessors/githubUser';
import getHabiticaApi from '@/app/api/v1/webhook/getHabiticaApi';
import {
  TaskAttribute,
  TaskDirection,
  TaskFrequency,
  TaskType,
} from '@/enums/habitica';
import logger from '@/lib/logger';

export const handlePush = async ({
  payload: { commits, repository, installation, sender },
}: EmitterWebhookEvent<'push'>) => {
  if (!installation?.id || !repository || !sender?.id) {
    logger.info('Ignored: Missing installation, repository, or sender.');
    return;
  }

  const validCommits = commits.filter(
    commit =>
      commit.author.username && !commit.author.username.includes('[bot]'),
  );

  if (validCommits.length === 0) {
    logger.info('Ignored: No valid commits found.');
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
      { repoId: repository.id },
      'Ignored: Repository not whitelisted.',
    );
    return;
  }

  // Extract unique usernames to minimize DB queries
  const authorUsernames = [
    ...new Set(validCommits.map(c => c.author.username!)),
  ];

  const githubUsers = await getLinkedGithubUsers(authorUsernames, 'push');

  if (githubUsers.length === 0) {
    logger.warn(
      'Ignored: There are no users with valid Habitica users or configured triggers.',
    );
    return;
  }

  await Promise.all(
    // Iterate through all GitHub users
    githubUsers.map(async user => {
      // Count how many commits this specific user owns in this push
      const userCommitCount = validCommits.filter(
        c => c.author.username === user.login,
      ).length;

      if (userCommitCount === 0) {
        return;
      }

      const habiticaApi = await getHabiticaApi(installation.id, user.login);

      if (!habiticaApi) {
        logger.error(
          { login: user.login },
          'Habitica API initialization failed.',
        );
        return;
      }

      // Setup Queue
      const queue = new PQueue({ concurrency: 4 });

      // Add tasks to queue
      const queueTasks = user.triggers.map(trigger => async () => {
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
            trigger.scoreDirection === 'up'
              ? TaskDirection.UP
              : TaskDirection.DOWN;

          // Score the task X times (sequentially to ensure reliability)
          for (let i = 0; i < userCommitCount; i++) {
            await habiticaApi.scoreTask(task.id, scoreDirection);
          }

          logger.info(
            {
              user: user.login,
              task: trigger.taskTitle,
              count: userCommitCount,
            },
            'Event processed successfully.',
          );
        } catch (error) {
          logger.error(
            { error, user: user.login, trigger: trigger.uuid },
            'Failed to process trigger',
          );
        }
      });

      // Execute queue
      await queue.addAll(queueTasks);
    }),
  );
};
