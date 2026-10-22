import logger from '@/lib/logger';

import { evaluateRewards } from './rewardPolicy';
import {
  RewardableEvent,
  RewardDirectory,
  RewardLog,
  RewardSink,
} from './types';

export type RewardDeps = {
  directory: RewardDirectory;
  sink: RewardSink;
  log: RewardLog;
};

/**
 * Rewards everyone who earned something with a GitHub event, and records it
 * in their history.
 */
export const deliverRewards = async (
  event: RewardableEvent,
  { directory, sink, log }: RewardDeps,
) => {
  const plan = await evaluateRewards(event, directory);

  await Promise.all(
    plan.map(async recipientRewards => {
      const isClaimed = await log.claim(event, recipientRewards.recipient);

      if (!isClaimed) {
        logger.info(
          { user: recipientRewards.recipient.login },
          'Ignored: Delivery was already rewarded.',
        );

        return;
      }

      await sink.apply(recipientRewards);
    }),
  );
};
