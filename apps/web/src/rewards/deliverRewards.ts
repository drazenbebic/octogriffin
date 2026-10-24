import logger from '@/lib/logger';

import { RewardDeliveryError } from './RewardDeliveryError';
import { evaluateRewards } from './rewardPolicy';
import type {
  Recipient,
  Reward,
  RewardableEvent,
  RewardDirectory,
  RewardLog,
  RewardSink,
  TriggerCooldowns,
} from './types';

export type RewardDeps = {
  cooldowns: TriggerCooldowns;
  directory: RewardDirectory;
  log: RewardLog;
  /** When the event is processed, which is when cooldowns start. */
  now?: () => Date;
  sink: RewardSink;
};

type ClaimedCooldown = {
  previousScoredAt: Date | null;
  triggerUuid: string;
};

/**
 * Rewards everyone who earned something with a GitHub event, and records it
 * in their history.
 */
export const deliverRewards = async (
  event: RewardableEvent,
  { cooldowns, directory, log, now = () => new Date(), sink }: RewardDeps,
) => {
  // One moment for the whole delivery, so a claim can be released exactly
  const processedAt = now();
  const plan = await evaluateRewards(event, directory, processedAt);

  const releaseCooldowns = (claims: ClaimedCooldown[]) =>
    Promise.all(
      claims.map(({ previousScoredAt, triggerUuid }) =>
        cooldowns.release(triggerUuid, processedAt, previousScoredAt),
      ),
    );

  /**
   * Nothing was scored, so give back the cooldowns and the delivery. Each is
   * given back even when the other fails, so a retry can still reward it.
   */
  const releaseEverything = async (
    claims: ClaimedCooldown[],
    recipient: Recipient,
  ) => {
    const results = await Promise.allSettled([
      releaseCooldowns(claims),
      log.release(event, recipient),
    ]);

    results.forEach(result => {
      if (result.status === 'rejected') {
        logger.error(
          { error: result.reason, user: recipient.login },
          'Failed to give back a claim.',
        );
      }
    });
  };

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

      const claims: ClaimedCooldown[] = [];
      const claimResults = await Promise.allSettled(
        recipientRewards.rewards.map(async (reward): Promise<Reward[]> => {
          if (!reward.cooldown) {
            return [reward];
          }

          const { previousScoredAt } = reward.cooldown;

          // Another delivery may have scored it since it was read
          if (
            !(await cooldowns.claim(
              reward.triggerUuid,
              previousScoredAt,
              processedAt,
            ))
          ) {
            logger.info(
              { trigger: reward.triggerUuid },
              'Ignored: Trigger is cooling down.',
            );

            return [];
          }

          claims.push({ previousScoredAt, triggerUuid: reward.triggerUuid });

          return [reward];
        }),
      );
      const failedClaim = claimResults.find(
        result => result.status === 'rejected',
      );

      // Every claim has settled, so the ones that succeeded can be given back
      if (failedClaim) {
        await releaseEverything(claims, recipientRewards.recipient);

        throw failedClaim.reason;
      }

      const rewards = claimResults.flatMap(result =>
        result.status === 'fulfilled' ? result.value : [],
      );

      if (rewards.length === 0) {
        await log.release(event, recipientRewards.recipient);

        return;
      }

      let scoredTriggerUuids: string[];

      try {
        scoredTriggerUuids = await sink.apply({ ...recipientRewards, rewards });
      } catch (error) {
        // Nothing was scored, so don't show it as rewarded
        await releaseEverything(claims, recipientRewards.recipient);

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

      // A trigger that scored nothing hasn't earned its rest
      await releaseCooldowns(
        claims.filter(
          ({ triggerUuid }) => !scoredTriggerUuids.includes(triggerUuid),
        ),
      );
    }),
  );

  const errors = results.flatMap(result =>
    result.status === 'rejected' ? [result.reason] : [],
  );

  if (errors.length > 0) {
    throw new AggregateError(errors, 'Some rewards could not be delivered.');
  }
};
