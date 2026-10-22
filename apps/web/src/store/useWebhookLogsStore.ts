import { create } from 'zustand';

import { getWebhookLogsAction } from '@/actions/webhookLogs/getWebhookLogsAction';
import type { WebhookLogsModel } from '@/generated/prisma/models/WebhookLogs';
import type { PaginationMeta, PaginationParams } from '@/types/pagination';

type WebhookLogsStoreState = {
  fetchWebhookLogs: (params?: PaginationParams) => Promise<void>;
  isLoading: boolean;
  meta: PaginationMeta;
  setLimit: (limit: number) => void;
  setPage: (page: number) => void;
  webhookLogs: WebhookLogsModel[];
};

export const useWebhookLogsStore = create<WebhookLogsStoreState>(
  (set, get) => ({
    fetchWebhookLogs: async (params = {}) => {
      set({ isLoading: true });

      const currentMeta = get().meta;
      let targetPage = params.page || currentMeta.page;
      const targetLimit = params.limit || currentMeta.limit;

      try {
        let result = await getWebhookLogsAction({
          limit: targetLimit,
          page: targetPage,
          ...params,
        });

        if (
          result.success &&
          result.data &&
          result.data.data.length === 0 &&
          targetPage > 1
        ) {
          targetPage = targetPage - 1;
          result = await getWebhookLogsAction({
            limit: targetLimit,
            page: targetPage,
            ...params,
          });
        }

        if (result.success && result.data) {
          set({
            meta: result.data.meta,
            webhookLogs: result.data.data,
          });
        } else {
          console.error('Failed to fetch webhookLogs:', result.error);
        }
      } catch (error) {
        console.error('Zustand fetchWebhookLogs error:', error);
      } finally {
        set({ isLoading: false });
      }
    },
    isLoading: false,
    meta: {
      limit: 5,
      page: 1,
      total: 0,
      totalPages: 0,
    },
    setLimit: (limit: number) => {
      get().fetchWebhookLogs({ limit, page: 1 });
    },
    setPage: (page: number) => {
      get().fetchWebhookLogs({ page });
    },
    webhookLogs: [],
  }),
);
