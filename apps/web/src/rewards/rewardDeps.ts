import { RewardDeps } from './deliverRewards';
import { habiticaRewardSink } from './habiticaRewardSink';
import { prismaRewardDirectory } from './prismaRewardDirectory';
import { prismaRewardLog } from './prismaRewardLog';

export const rewardDeps: RewardDeps = {
  directory: prismaRewardDirectory,
  sink: habiticaRewardSink,
  log: prismaRewardLog,
};
