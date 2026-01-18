import { toast } from 'sonner';
import { create } from 'zustand';

import { getHabiticaCredentialsAction } from '@/actions/habitica/getHabiticaCredentialsAction';
import { getHabiticaStatsAction } from '@/actions/habitica/getHabiticaStatsAction';
import { isHabiticaConnectedAction } from '@/actions/habitica/isHabiticaConnectedAction';
import { upsertHabiticaUserAction } from '@/actions/habitica/upsertHabiticaUserAction';
import { HabiticaUserSchema } from '@/schemas/habiticaUserSchema';
import { UserCredentials, UserStats } from '@/types/habitica';

type HabiticaStoreState = {
  isLoading: boolean;
  isHabiticaConnected: boolean;
  habiticaStats: UserStats | null;
  habiticaCredentials: UserCredentials | null;
  setIsLoading: (isLoading: boolean) => void;
  fetchHabiticaCredentials: () => Promise<UserCredentials | null>;
  fetchHabiticaStats: () => Promise<UserStats | null>;
  fetchHabiticaConnection: () => Promise<boolean>;
  upsertHabiticaUser: (
    data: HabiticaUserSchema,
  ) => Promise<UserCredentials | null>;
};

export const useHabiticaStore = create<HabiticaStoreState>(set => ({
  isLoading: false,
  isHabiticaConnected: false,
  habiticaStats: null,
  habiticaCredentials: null,
  setIsLoading: isLoading => set({ isLoading }),
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
  fetchHabiticaConnection: async () => {
    try {
      const isHabiticaConnected = await isHabiticaConnectedAction();
      set({ isHabiticaConnected });
      return true;
    } catch (error) {
      console.error('Zustand connection check error:', error);
      set({ isHabiticaConnected: false });

      return false;
    }
  },
  upsertHabiticaUser: async data => {
    try {
      const result = await upsertHabiticaUserAction(data);

      if (!result.success || !result.data) {
        toast.error(result.error || 'Failed to save configuration');
        return null;
      }

      const credentials = {
        userId: result.data.userId,
        apiToken: result.data.apiToken,
      };

      set({ habiticaCredentials: credentials });

      return credentials;
    } catch (error) {
      console.error('Zustand upsert error:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  },
}));
