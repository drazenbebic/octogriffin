import { evaluateRewards } from './rewardPolicy';
import { RewardableEvent, RewardDirectory, RewardSink } from './types';

export type RewardDeps = {
  directory: RewardDirectory;
  sink: RewardSink;
};

/**
 * Rewards everyone who earned something with a GitHub event.
 */
export const deliverRewards = async (
  event: RewardableEvent,
  { directory, sink }: RewardDeps,
) => {
  const plan = await evaluateRewards(event, directory);

  await Promise.all(plan.map(recipientRewards => sink.apply(recipientRewards)));
};
