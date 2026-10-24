import type { RewardDeps } from './deliverRewards';
import { habiticaDays } from './habiticaDays';
import { habiticaRewardSink } from './habiticaRewardSink';
import { prismaRewardDirectory } from './prismaRewardDirectory';
import { prismaRewardLog } from './prismaRewardLog';
import { prismaTriggerCaps } from './prismaTriggerCaps';
import { prismaTriggerCooldowns } from './prismaTriggerCooldowns';

export const rewardDeps: RewardDeps = {
  caps: prismaTriggerCaps,
  cooldowns: prismaTriggerCooldowns,
  days: habiticaDays,
  directory: prismaRewardDirectory,
  log: prismaRewardLog,
  sink: habiticaRewardSink,
};
