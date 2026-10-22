import { RewardDeps } from './deliverRewards';
import { habiticaRewardSink } from './habiticaRewardSink';
import { prismaRewardDirectory } from './prismaRewardDirectory';

export const rewardDeps: RewardDeps = {
  directory: prismaRewardDirectory,
  sink: habiticaRewardSink,
};
