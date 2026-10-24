import logger from '@/lib/logger';
import type { UserCredentials } from '@/types/habitica';

import { RewardDeliveryError } from './RewardDeliveryError';
import { evaluateRewards } from './rewardPolicy';
import type {
  HabiticaDays,
  Recipient,
  Reward,
  RewardableEvent,
  RewardDirectory,
  RewardLog,
  RewardSink,
  TriggerCaps,
  TriggerCooldowns,
} from './types';

export type RewardDeps = {
  caps: TriggerCaps;
  cooldowns: TriggerCooldowns;
  days: HabiticaDays;
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

type ClaimedCap = {
  day: string;
  granted: number;
  triggerUuid: string;
};

/** Settles every claim, then fails with the first error, if any. */
const settleClaims = async (claims: Promise<Reward[]>[]) => {
  const results = await Promise.allSettled(claims);
  const failed = results.find(result => result.status === 'rejected');

  if (failed) {
    throw failed.reason;
  }

  return results.flatMap(result =>
    result.status === 'fulfilled' ? result.value : [],
  );
};

/**
 * Rewards everyone who earned something with a GitHub event, and records it
 * in their history.
 */
export const deliverRewards = async (
  event: RewardableEvent,
  {
    caps,
    cooldowns,
    days,
    directory,
    log,
    now = () => new Date(),
    sink,
  }: RewardDeps,
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

  /** Gives back the slots each trigger was granted but didn't score. */
  const releaseCaps = (
    grants: ClaimedCap[],
    scored: Record<string, number> = {},
  ) =>
    Promise.all(
      grants.flatMap(({ day, granted, triggerUuid }) => {
        const unused = granted - (scored[triggerUuid] ?? 0);

        return unused > 0 ? [caps.release(triggerUuid, day, unused)] : [];
      }),
    );

  /**
   * Nothing was scored, so give back the cooldowns, the cap slots and the
   * delivery. Each is given back even when another fails, so a retry can
   * still reward it.
   */
  const releaseEverything = async (
    claims: ClaimedCooldown[],
    grants: ClaimedCap[],
    recipient: Recipient,
  ) => {
    const results = await Promise.allSettled([
      releaseCooldowns(claims),
      releaseCaps(grants),
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

  /** Keeps the rewards whose cooldown is over, recording each claim. */
  const claimCooldowns = (rewards: Reward[], claims: ClaimedCooldown[]) =>
    settleClaims(
      rewards.map(async reward => {
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

  /** Trims each reward to what fits under its daily cap, recording grants. */
  const claimCaps = async (
    rewards: Reward[],
    credentials: UserCredentials,
    grants: ClaimedCap[],
  ) => {
    if (!rewards.some(({ hasDailyCap }) => hasDailyCap)) {
      return rewards;
    }

    const day = await days.today(credentials, processedAt);

    return settleClaims(
      rewards.map(async reward => {
        if (!reward.hasDailyCap) {
          return [reward];
        }

        const granted = await caps.claim(reward.triggerUuid, day, reward.times);

        if (granted === 0) {
          logger.info(
            { trigger: reward.triggerUuid },
            'Ignored: Trigger reached its daily cap.',
          );

          return [];
        }

        grants.push({ day, granted, triggerUuid: reward.triggerUuid });

        return [{ ...reward, times: granted }];
      }),
    );
  };

  const results = await Promise.allSettled(
    plan.map(async recipientRewards => {
      const { recipient } = recipientRewards;
      const isClaimed = await log.claim(event, recipient);

      if (!isClaimed) {
        logger.info(
          { user: recipient.login },
          'Ignored: Delivery was already rewarded.',
        );

        return;
      }

      let claims: ClaimedCooldown[] = [];
      const grants: ClaimedCap[] = [];
      let rewards: Reward[];

      try {
        rewards = await claimCaps(
          await claimCooldowns(recipientRewards.rewards, claims),
          recipient.credentials,
          grants,
        );

        // A trigger stopped by its cap won't score, so it hasn't earned its rest
        const kept = new Set(rewards.map(({ triggerUuid }) => triggerUuid));
        const stopped = claims.filter(
          ({ triggerUuid }) => !kept.has(triggerUuid),
        );

        await releaseCooldowns(stopped);
        claims = claims.filter(claim => !stopped.includes(claim));
      } catch (error) {
        // Every claim has settled, so the ones that succeeded can be given back
        await releaseEverything(claims, grants, recipient);

        if (error instanceof RewardDeliveryError && !error.isRetryable) {
          logger.warn(
            { user: recipient.login },
            'Ignored: Habitica refused to say when the day starts, trying again would not help.',
          );

          return;
        }

        throw error;
      }

      if (rewards.length === 0) {
        await log.release(event, recipient);

        return;
      }

      let scored: Record<string, number>;

      try {
        scored = await sink.apply({ ...recipientRewards, rewards });
      } catch (error) {
        // Nothing was scored, so don't show it as rewarded
        await releaseEverything(claims, grants, recipient);

        if (error instanceof RewardDeliveryError && !error.isRetryable) {
          logger.warn(
            { user: recipient.login },
            'Ignored: Habitica refused every reward, trying again would not help.',
          );

          return;
        }

        // Let a retry deliver it
        throw error;
      }

      // A trigger that scored nothing hasn't earned its rest, and slots it
      // didn't use are free again
      await Promise.all([
        releaseCooldowns(
          claims.filter(({ triggerUuid }) => !scored[triggerUuid]),
        ),
        releaseCaps(grants, scored),
      ]);
    }),
  );

  const errors = results.flatMap(result =>
    result.status === 'rejected' ? [result.reason] : [],
  );

  if (errors.length > 0) {
    throw new AggregateError(errors, 'Some rewards could not be delivered.');
  }
};
