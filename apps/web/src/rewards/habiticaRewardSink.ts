import PQueue from 'p-queue';

import { TaskType } from '@/enums/habitica';
import HabiticaApi from '@/lib/HabiticaApi';
import logger from '@/lib/logger';

import type { RewardSink } from './types';

export const habiticaRewardSink: RewardSink = {
  apply: async ({ recipient, rewards }) => {
    const habiticaApi = new HabiticaApi(
      recipient.credentials.userId,
      recipient.credentials.apiToken,
    );

    const queue = new PQueue({ concurrency: 4 });
    const errors: unknown[] = [];
    let scoredCount = 0;

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
            scoredCount++;
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
    if (scoredCount === 0 && errors.length > 0) {
      throw new AggregateError(errors, 'No reward could be scored.');
    }
  },
};
