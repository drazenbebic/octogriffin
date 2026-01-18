import { toast } from 'sonner';
import { create } from 'zustand';

import { createTriggerAction } from '@/actions/triggers/createTriggerAction';
import { deleteTriggerAction } from '@/actions/triggers/deleteTriggerAction';
import { getTriggersAction } from '@/actions/triggers/getTriggersAction';
import { toggleTriggerAction } from '@/actions/triggers/toggleTriggerAction';
import { updateTriggerAction } from '@/actions/triggers/updateTriggerAction';
import { TriggersModel } from '@/generated/prisma/models/Triggers';
import { ToggleTriggerSchema } from '@/schemas/toggleTriggerSchema';
import { TriggerSchema } from '@/schemas/triggerSchema';
import { PaginationMeta, PaginationParams } from '@/types/pagination';

type TriggersStoreState = {
  trigger: TriggersModel | null;
  triggers: TriggersModel[];
  meta: PaginationMeta;
  isLoading: boolean;
  fetchTriggers: (params?: PaginationParams) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  createTrigger: (data: TriggerSchema) => Promise<TriggersModel | null>;
  deleteTrigger: (uuid: string) => Promise<TriggersModel | null>;
  toggleTrigger: (data: ToggleTriggerSchema) => Promise<TriggersModel | null>;
  updateTrigger: (
    uuid: string,
    data: TriggerSchema,
  ) => Promise<TriggersModel | null>;
};

export const useTriggersStore = create<TriggersStoreState>((set, get) => ({
  trigger: null,
  triggers: [],
  isLoading: false,
  meta: {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  },
  fetchTriggers: async (params = {}) => {
    set({ isLoading: true });

    const currentMeta = get().meta;
    let targetPage = params.page || currentMeta.page;
    const targetLimit = params.limit || currentMeta.limit;

    try {
      let result = await getTriggersAction({
        page: targetPage,
        limit: targetLimit,
        ...params,
      });

      if (
        result.success &&
        result.data &&
        result.data.data.length === 0 &&
        targetPage > 1
      ) {
        targetPage = targetPage - 1;
        result = await getTriggersAction({
          page: targetPage,
          limit: targetLimit,
          ...params,
        });
      }

      if (result.success && result.data) {
        set({
          triggers: result.data.data,
          meta: result.data.meta,
        });
      } else {
        console.error('Failed to fetch triggers:', result.error);
      }
    } catch (error) {
      console.error('Zustand fetchTriggers error:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  setPage: (page: number) => {
    get().fetchTriggers({ page });
  },
  setLimit: (limit: number) => {
    get().fetchTriggers({ page: 1, limit });
  },
  createTrigger: async data => {
    set({ isLoading: true });

    try {
      const result = await createTriggerAction(data);

      if (!result.success || !result.data) {
        toast.error(result.error || 'Failed to create trigger');
        set({ isLoading: false });

        return null;
      }

      await get().fetchTriggers({ page: 1 });

      return result.data;
    } catch (error) {
      console.error('Zustand createTrigger error:', error);
      toast.error('An unexpected error occurred');
      set({ isLoading: false });

      return null;
    }
  },
  deleteTrigger: async uuid => {
    set({ isLoading: true });

    try {
      const result = await deleteTriggerAction(uuid);

      if (!result.success || !result.data) {
        toast.error(result.error || 'Failed to delete trigger');
        set({ isLoading: false });

        return null;
      }

      await get().fetchTriggers();

      return result.data;
    } catch (error) {
      console.error('Zustand deleteTrigger error:', error);
      toast.error('An unexpected error occurred');
      set({ isLoading: false });

      return null;
    }
  },
  toggleTrigger: async data => {
    const previousTriggers = get().triggers;
    set(state => ({
      triggers: state.triggers.map(t =>
        t.uuid === data.uuid ? { ...t, isActive: data.isActive } : t,
      ),
    }));

    try {
      const result = await toggleTriggerAction(data);

      if (!result.success || !result.data) {
        toast.error(result.error || 'Failed to update status');
        set({ triggers: previousTriggers });

        return null;
      }

      return result.data;
    } catch (error) {
      console.error('Zustand toggleTrigger error:', error);
      toast.error('An unexpected error occurred');
      set({ triggers: previousTriggers });

      return null;
    }
  },
  updateTrigger: async (uuid, data) => {
    const previousTriggers = get().triggers;

    set(state => ({
      triggers: state.triggers.map(t =>
        t.uuid === uuid ? { ...t, ...data } : t,
      ),
    }));

    try {
      const result = await updateTriggerAction(uuid, data);

      if (!result.success || !result.data) {
        toast.error(result.error || 'Failed to update trigger');
        set({ triggers: previousTriggers });

        return null;
      }

      set(state => ({
        triggers: state.triggers.map(t => (t.uuid === uuid ? result.data! : t)),
      }));

      return result.data;
    } catch (error) {
      console.error('Zustand updateTrigger error:', error);
      toast.error('An unexpected error occurred');
      set({ triggers: previousTriggers });

      return null;
    }
  },
}));
