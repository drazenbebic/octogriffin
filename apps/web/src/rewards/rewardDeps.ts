import type { RewardDeps } from './deliverRewards';
import { habiticaRewardSink } from './habiticaRewardSink';
import { prismaRewardDirectory } from './prismaRewardDirectory';
import { prismaRewardLog } from './prismaRewardLog';
import { prismaTriggerCooldowns } from './prismaTriggerCooldowns';

export const rewardDeps: RewardDeps = {
  cooldowns: prismaTriggerCooldowns,
  directory: prismaRewardDirectory,
  log: prismaRewardLog,
  sink: habiticaRewardSink,
};
