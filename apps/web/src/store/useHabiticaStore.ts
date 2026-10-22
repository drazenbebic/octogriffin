import { toast } from 'sonner';
import { create } from 'zustand';

import { getHabiticaCredentialsAction } from '@/actions/habitica/getHabiticaCredentialsAction';
import { getHabiticaStatsAction } from '@/actions/habitica/getHabiticaStatsAction';
import { isHabiticaConnectedAction } from '@/actions/habitica/isHabiticaConnectedAction';
import { upsertHabiticaUserAction } from '@/actions/habitica/upsertHabiticaUserAction';
import type { HabiticaUserSchema } from '@/schemas/habiticaUserSchema';
import type { HabiticaAccount, UserStats } from '@/types/habitica';

type HabiticaStoreState = {
  fetchHabiticaConnection: () => Promise<boolean>;
  fetchHabiticaCredentials: () => Promise<HabiticaAccount | null>;
  fetchHabiticaStats: () => Promise<null | UserStats>;
  habiticaCredentials: HabiticaAccount | null;
  habiticaStats: null | UserStats;
  isHabiticaConnected: boolean;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  upsertHabiticaUser: (
    data: HabiticaUserSchema,
  ) => Promise<HabiticaAccount | null>;
};

export const useHabiticaStore = create<HabiticaStoreState>(set => ({
  fetchHabiticaConnection: async () => {
    try {
      const result = await isHabiticaConnectedAction();
      const isHabiticaConnected = result.success && !!result.data;
      set({ isHabiticaConnected });

      return isHabiticaConnected;
    } catch (error) {
      console.error('Zustand connection check error:', error);
      set({ isHabiticaConnected: false });

      return false;
    }
  },
  fetchHabiticaCredentials: async () => {
    try {
      const result = await getHabiticaCredentialsAction();

      if (result.success && result.data) {
        set({ habiticaCredentials: result.data });

        return result.data;
      }

      return null;
    } catch (error) {
      console.error('Zustand fetch credentials error:', error);

      return null;
    }
  },
  fetchHabiticaStats: async () => {
    set({ isLoading: true });

    try {
      const result = await getHabiticaStatsAction();

      if (result.success && result.data) {
        set({ habiticaStats: result.data });

        return result.data;
      }

      return null;
    } catch (error) {
      console.error('Zustand fetch stats error:', error);

      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  habiticaCredentials: null,
  habiticaStats: null,
  isHabiticaConnected: false,
  isLoading: false,
  setIsLoading: isLoading => set({ isLoading }),
  upsertHabiticaUser: async data => {
    try {
      const result = await upsertHabiticaUserAction(data);

      if (!result.success || !result.data) {
        toast.error(result.error || 'Failed to save configuration');

        return null;
      }

      set({ habiticaCredentials: result.data });

      return result.data;
    } catch (error) {
      console.error('Zustand upsert error:', error);
      toast.error('An unexpected error occurred');

      return null;
    }
  },
}));
