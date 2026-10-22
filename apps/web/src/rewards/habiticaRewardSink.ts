import PQueue from 'p-queue';

import { TaskType } from '@/enums/habitica';
import HabiticaApi from '@/lib/HabiticaApi';
import logger from '@/lib/logger';

import { RewardSink } from './types';

export const habiticaRewardSink: RewardSink = {
  apply: async ({ recipient, rewards }) => {
    const habiticaApi = new HabiticaApi(
      recipient.credentials.userId,
      recipient.credentials.apiToken,
    );

    const queue = new PQueue({ concurrency: 4 });

    await queue.addAll(
      rewards.map(reward => async () => {
        try {
          const task = await habiticaApi.findOrCreateTask({
            type: TaskType.HABIT,
            text: reward.task.title,
            alias: reward.task.alias,
            notes: reward.task.note,
            priority: reward.task.priority,
            attribute: reward.task.attribute,
            frequency: reward.task.frequency,
          });

          // Score sequentially to ensure reliability
          for (let i = 0; i < reward.times; i++) {
            await habiticaApi.scoreTask(task.id, reward.direction);
          }

          logger.info(
            {
              user: recipient.login,
              task: reward.task.title,
              count: reward.times,
            },
            'Event processed successfully.',
          );
        } catch (error) {
          logger.error(
            { error, user: recipient.login, trigger: reward.triggerUuid },
            'Failed to process trigger',
          );
        }
      }),
    );
  },
};
