import { toast } from 'sonner';
import { create } from 'zustand';

import { createTriggerAction } from '@/actions/triggers/createTriggerAction';
import { deleteTriggerAction } from '@/actions/triggers/deleteTriggerAction';
import { getTriggersAction } from '@/actions/triggers/getTriggersAction';
import { toggleTriggerAction } from '@/actions/triggers/toggleTriggerAction';
import { updateTriggerAction } from '@/actions/triggers/updateTriggerAction';
import type { TriggersModel } from '@/generated/prisma/models/Triggers';
import type { ToggleTriggerSchema } from '@/schemas/toggleTriggerSchema';
import type { TriggerSchema } from '@/schemas/triggerSchema';
import type { PaginationMeta, PaginationParams } from '@/types/pagination';

type TriggersStoreState = {
  createTrigger: (data: TriggerSchema) => Promise<null | TriggersModel>;
  deleteTrigger: (uuid: string) => Promise<null | TriggersModel>;
  fetchTriggers: (params?: PaginationParams) => Promise<void>;
  /** True once the first load has finished, even if it found nothing. */
  hasLoaded: boolean;
  isLoading: boolean;
  meta: PaginationMeta;
  /** Triggers created during this visit, marked as new in the list. */
  recentlyCreated: string[];
  setLimit: (limit: number) => void;
  setPage: (page: number) => void;
  toggleTrigger: (data: ToggleTriggerSchema) => Promise<null | TriggersModel>;
  trigger: null | TriggersModel;
  triggers: TriggersModel[];
  updateTrigger: (
    uuid: string,
    data: TriggerSchema,
  ) => Promise<null | TriggersModel>;
};

export const useTriggersStore = create<TriggersStoreState>((set, get) => {
  /**
   * Loads a page of triggers. The list only shows its loading skeleton when
   * `showSkeleton` is set, so refreshing after a change keeps it on screen.
   */
  const loadTriggers = async (
    params: PaginationParams,
    { showSkeleton }: { showSkeleton: boolean },
  ) => {
    if (showSkeleton) {
      set({ isLoading: true });
    }

    const currentMeta = get().meta;
    let targetPage = params.page || currentMeta.page;
    const targetLimit = params.limit || currentMeta.limit;

    try {
      let result = await getTriggersAction({
        limit: targetLimit,
        page: targetPage,
        ...params,
      });

      if (result.success && result.data?.data.length === 0 && targetPage > 1) {
        targetPage = targetPage - 1;
        result = await getTriggersAction({
          limit: targetLimit,
          page: targetPage,
          ...params,
        });
      }

      if (result.success && result.data) {
        set({
          meta: result.data.meta,
          triggers: result.data.data,
        });
      } else {
        console.error('Failed to fetch triggers:', result.error);
      }
    } catch (error) {
      console.error('Zustand fetchTriggers error:', error);
    } finally {
      set(
        showSkeleton
          ? { hasLoaded: true, isLoading: false }
          : { hasLoaded: true },
      );
    }
  };

  return {
    createTrigger: async data => {
      try {
        const result = await createTriggerAction(data);

        if (!result.success || !result.data) {
          toast.error(result.error || 'Failed to create trigger');

          return null;
        }

        set(state => ({
          recentlyCreated: [...state.recentlyCreated, result.data!.uuid],
        }));
        await loadTriggers({ page: 1 }, { showSkeleton: false });

        return result.data;
      } catch (error) {
        console.error('Zustand createTrigger error:', error);
        toast.error('An unexpected error occurred');

        return null;
      }
    },
    deleteTrigger: async uuid => {
      try {
        const result = await deleteTriggerAction(uuid);

        if (!result.success || !result.data) {
          toast.error(result.error || 'Failed to delete trigger');

          return null;
        }

        await loadTriggers({}, { showSkeleton: false });

        return result.data;
      } catch (error) {
        console.error('Zustand deleteTrigger error:', error);
        toast.error('An unexpected error occurred');

        return null;
      }
    },
    fetchTriggers: (params = {}) =>
      loadTriggers(params, { showSkeleton: true }),
    hasLoaded: false,
    isLoading: false,
    meta: {
      limit: 5,
      page: 1,
      total: 0,
      totalPages: 0,
    },
    recentlyCreated: [],
    setLimit: (limit: number) => {
      get().fetchTriggers({ limit, page: 1 });
    },
    setPage: (page: number) => {
      get().fetchTriggers({ page });
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
    trigger: null,
    triggers: [],
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
          triggers: state.triggers.map(t =>
            t.uuid === uuid ? result.data! : t,
          ),
        }));

        return result.data;
      } catch (error) {
        console.error('Zustand updateTrigger error:', error);
        toast.error('An unexpected error occurred');
        set({ triggers: previousTriggers });

        return null;
      }
    },
  };
});
