import HabiticaApi from '@/lib/HabiticaApi';
import { getHabiticaDay } from '@/utils/habiticaDay';

import { isRetryable, RewardDeliveryError } from './RewardDeliveryError';
import type { HabiticaDays } from './types';

/** Looks up the Habitica day, giving up at `deadline`. */
export const habiticaDays = (deadline?: AbortSignal): HabiticaDays => ({
  // Asked every time, as Habitica moves the offset when clocks change
  today: async ({ apiToken, userId }, now) => {
    try {
      const preferences = await new HabiticaApi(
        userId,
        apiToken,
        deadline,
      ).getDayPreferences();

      return getHabiticaDay(now, preferences);
    } catch (error) {
      // The same rule as scoring, so a refused token isn't asked again
      throw new RewardDeliveryError([error], isRetryable(error));
    }
  },
});
