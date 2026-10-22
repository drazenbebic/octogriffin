import { TaskAttribute, TaskDirection, TaskFrequency } from '@/enums/habitica';
import logger from '@/lib/logger';

import {
  Actor,
  LinkedUser,
  RecipientRewards,
  Reward,
  RewardableEvent,
  RewardDirectory,
  TriggerRule,
} from './types';

const isSameActor = (actor: Actor, user: LinkedUser) =>
  'githubId' in actor
    ? actor.githubId === user.githubId
    : actor.login === user.login;

const toReward = (trigger: TriggerRule, times: number): Reward => ({
  triggerUuid: trigger.uuid,
  task: {
    title: trigger.taskTitle,
    alias: trigger.taskAlias || undefined,
    note: trigger.taskNote || undefined,
    priority: trigger.taskPriority,
    attribute: trigger.taskAttribute as TaskAttribute,
    frequency: trigger.taskFrequency as TaskFrequency,
  },
  direction:
    trigger.scoreDirection === 'up' ? TaskDirection.UP : TaskDirection.DOWN,
  times,
});

/**
 * Decides who gets rewarded for a GitHub event, for which triggers, and how
 * many times.
 */
export const evaluateRewards = async (
  event: RewardableEvent,
  directory: RewardDirectory,
): Promise<RecipientRewards[]> => {
  const contributions = event.contributions.filter(({ count }) => count > 0);

  if (contributions.length === 0) {
    logger.info('Ignored: No contributions.');

    return [];
  }

  const installation = await directory.getInstallationStatus(
    event.installationId,
    event.repositoryId,
  );

  if (!installation) {
    logger.info('Ignored: Installation not found.');

    return [];
  }

  if (installation.isSuspended) {
    logger.info('Ignored: Installation is suspended.');

    return [];
  }

  if (!installation.isRepositorySelected) {
    logger.info(
      { repositoryId: event.repositoryId },
      'Ignored: Repository not whitelisted.',
    );

    return [];
  }

  const users = await directory.findLinkedUsers(
    contributions.map(({ actor }) => actor),
  );

  const plan = users
    // Only the owner of the installation is rewarded for its events.
    .filter(user => user.installationId === event.installationId)
    .map(user => {
      const times = contributions
        .filter(({ actor }) => isSameActor(actor, user))
        .reduce((sum, { count }) => sum + count, 0);

      const rewards = user.triggers
        .filter(trigger => trigger.isActive && trigger.event === event.name)
        .map(trigger => toReward(trigger, times));

      return {
        recipient: {
          githubUserId: user.id,
          login: user.login,
          credentials: user.credentials,
        },
        rewards,
      };
    })
    .filter(({ rewards }) => rewards.length > 0);

  if (plan.length === 0) {
    logger.info('Ignored: No linked users with matching triggers.');
  }

  return plan;
};
