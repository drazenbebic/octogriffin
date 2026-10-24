import PQueue from 'p-queue';

import { TaskType } from '@/enums/habitica';
import HabiticaApi, { HabiticaApiError } from '@/lib/HabiticaApi';
import logger from '@/lib/logger';

import { RewardDeliveryError } from './RewardDeliveryError';
import type { RewardSink } from './types';

const TOO_MANY_REQUESTS = 429;
const SERVER_ERROR = 500;

/**
 * Habitica refusing a request, e.g. for a wrong API token, won't change by
 * trying again. Everything else, like Habitica being down, might.
 */
const isRetryable = (error: unknown) =>
  !(error instanceof HabiticaApiError) ||
  error.status === TOO_MANY_REQUESTS ||
  error.status >= SERVER_ERROR;

export const habiticaRewardSink: RewardSink = {
  apply: async ({ recipient, rewards }) => {
    const habiticaApi = new HabiticaApi(
      recipient.credentials.userId,
      recipient.credentials.apiToken,
    );

    const queue = new PQueue({ concurrency: 4 });
    const errors: unknown[] = [];
    const scoredTriggerUuids = new Set<string>();

    await queue.addAll(
      rewards.map(reward => async () => {
        try {
          const task = await habiticaApi.findOrCreateTask({
            alias: reward.task.alias,
            attribute: reward.task.attribute,
            frequency: reward.task.frequency,
            notes: reward.task.note,
            priority: reward.task.priority,
            text: reward.task.title,
            type: TaskType.HABIT,
          });

          // Score sequentially to ensure reliability
          for (let i = 0; i < reward.times; i++) {
            await habiticaApi.scoreTask(task.id, reward.direction);
            scoredTriggerUuids.add(reward.triggerUuid);
          }

          logger.info(
            {
              count: reward.times,
              task: reward.task.title,
              user: recipient.login,
            },
            'Event processed successfully.',
          );
        } catch (error) {
          errors.push(error);

          logger.error(
            { error, trigger: reward.triggerUuid, user: recipient.login },
            'Failed to process trigger',
          );
        }
      }),
    );

    // Partly scored rewards aren't retried, that would score some of them twice
    if (scoredTriggerUuids.size === 0 && errors.length > 0) {
      throw new RewardDeliveryError(errors, errors.some(isRetryable));
    }

    // In reward order, as the queue finishes them in any order
    return rewards
      .map(({ triggerUuid }) => triggerUuid)
      .filter(triggerUuid => scoredTriggerUuids.has(triggerUuid));
  },
};
