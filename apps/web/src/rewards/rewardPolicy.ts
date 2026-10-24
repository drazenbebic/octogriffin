import type { TaskAttribute, TaskFrequency } from '@/enums/habitica';
import { TaskDirection } from '@/enums/habitica';
import logger from '@/lib/logger';

import type {
  Actor,
  LinkedUser,
  RecipientRewards,
  Reward,
  RewardableEvent,
  RewardDirectory,
  TriggerRule,
} from './types';

const DEFAULT_MAX_TIMES_PER_EVENT = 10;

/**
 * How often a single trigger may score for one event, e.g. a push with many
 * commits. Instance operators can change it with `MAX_REWARDS_PER_EVENT`.
 */
const getMaxTimesPerEvent = () => {
  const max = Number(process.env.MAX_REWARDS_PER_EVENT);

  return Number.isInteger(max) && max > 0 ? max : DEFAULT_MAX_TIMES_PER_EVENT;
};

const isSameActor = (actor: Actor, user: LinkedUser) =>
  'githubId' in actor
    ? actor.githubId === user.githubId
    : actor.login === user.login;

const isCoolingDown = (
  { cooldownSeconds, lastScoredAt }: TriggerRule,
  now: Date,
) =>
  cooldownSeconds !== null &&
  lastScoredAt !== null &&
  now.getTime() - lastScoredAt.getTime() < cooldownSeconds * 1000;

const toReward = (trigger: TriggerRule, times: number): Reward => ({
  ...(trigger.cooldownSeconds !== null && {
    cooldown: { previousScoredAt: trigger.lastScoredAt },
  }),
  ...(trigger.dailyCap !== null && { hasDailyCap: true as const }),
  direction:
    trigger.scoreDirection === 'up' ? TaskDirection.UP : TaskDirection.DOWN,
  task: {
    alias: trigger.taskAlias || undefined,
    attribute: trigger.taskAttribute as TaskAttribute,
    frequency: trigger.taskFrequency as TaskFrequency,
    note: trigger.taskNote || undefined,
    priority: trigger.taskPriority,
    title: trigger.taskTitle,
  },
  times,
  triggerUuid: trigger.uuid,
});

/**
 * Decides who gets rewarded for a GitHub event, for which triggers, and how
 * many times.
 */
export const evaluateRewards = async (
  event: RewardableEvent,
  directory: RewardDirectory,
  now: Date,
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
    .filter(user => user.installationIds.includes(event.installationId))
    .map(user => {
      const times = Math.min(
        contributions
          .filter(({ actor }) => isSameActor(actor, user))
          .reduce((sum, { count }) => sum + count, 0),
        getMaxTimesPerEvent(),
      );

      const rewards = user.triggers
        .filter(
          trigger =>
            trigger.isActive &&
            trigger.event === event.name &&
            trigger.repositoryIds.includes(event.repositoryId),
        )
        .filter(trigger => {
          if (!isCoolingDown(trigger, now)) {
            return true;
          }

          logger.info(
            { trigger: trigger.uuid },
            'Ignored: Trigger is cooling down.',
          );

          return false;
        })
        .map(trigger => toReward(trigger, times));

      return {
        recipient: {
          credentials: user.credentials,
          githubUserId: user.id,
          login: user.login,
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
