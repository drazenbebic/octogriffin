import logger from '@/lib/logger';

import { RewardDeliveryError } from './RewardDeliveryError';
import { evaluateRewards } from './rewardPolicy';
import type {
  RewardableEvent,
  RewardDirectory,
  RewardLog,
  RewardSink,
} from './types';

export type RewardDeps = {
  directory: RewardDirectory;
  log: RewardLog;
  sink: RewardSink;
};

/**
 * Rewards everyone who earned something with a GitHub event, and records it
 * in their history.
 */
export const deliverRewards = async (
  event: RewardableEvent,
  { directory, log, sink }: RewardDeps,
) => {
  const plan = await evaluateRewards(event, directory);

  const results = await Promise.allSettled(
    plan.map(async recipientRewards => {
      const isClaimed = await log.claim(event, recipientRewards.recipient);

      if (!isClaimed) {
        logger.info(
          { user: recipientRewards.recipient.login },
          'Ignored: Delivery was already rewarded.',
        );

        return;
      }

      try {
        await sink.apply(recipientRewards);
      } catch (error) {
        // Nothing was scored, so don't show it as rewarded
        await log.release(event, recipientRewards.recipient);

        if (error instanceof RewardDeliveryError && !error.isRetryable) {
          logger.warn(
            { user: recipientRewards.recipient.login },
            'Ignored: Habitica refused every reward, trying again would not help.',
          );

          return;
        }

        // Let a retry deliver it
        throw error;
      }
    }),
  );

  const errors = results.flatMap(result =>
    result.status === 'rejected' ? [result.reason] : [],
  );

  if (errors.length > 0) {
    throw new AggregateError(errors, 'Some rewards could not be delivered.');
  }
};
