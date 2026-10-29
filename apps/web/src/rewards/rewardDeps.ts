import type { RewardDeps } from './deliverRewards';
import { habiticaDays } from './habiticaDays';
import { habiticaRewardSink } from './habiticaRewardSink';
import { prismaRewardDirectory } from './prismaRewardDirectory';
import { prismaRewardLog } from './prismaRewardLog';
import { prismaTriggerCaps } from './prismaTriggerCaps';
import { prismaTriggerCooldowns } from './prismaTriggerCooldowns';

/** The production adapters, with every Habitica call ending at `deadline`. */
export const rewardDeps = (deadline?: AbortSignal): RewardDeps => ({
  caps: prismaTriggerCaps,
  cooldowns: prismaTriggerCooldowns,
  days: habiticaDays(deadline),
  directory: prismaRewardDirectory,
  log: prismaRewardLog,
  sink: habiticaRewardSink(deadline),
});
