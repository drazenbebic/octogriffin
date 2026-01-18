import { create } from 'zustand';

import { getWebhookLogsAction } from '@/actions/webhookLogs/getWebhookLogsAction';
import { WebhookLogsModel } from '@/generated/prisma/models/WebhookLogs';
import { PaginationMeta, PaginationParams } from '@/types/pagination';

type WebhookLogsStoreState = {
  webhookLogs: WebhookLogsModel[];
  meta: PaginationMeta;
  isLoading: boolean;
  fetchWebhookLogs: (params?: PaginationParams) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
};

export const useWebhookLogsStore = create<WebhookLogsStoreState>(
  (set, get) => ({
    webhookLogs: [],
    isLoading: false,
    meta: {
      page: 1,
      limit: 5,
      total: 0,
      totalPages: 0,
    },
    fetchWebhookLogs: async (params = {}) => {
      set({ isLoading: true });

      const currentMeta = get().meta;
      let targetPage = params.page || currentMeta.page;
      const targetLimit = params.limit || currentMeta.limit;

      try {
        let result = await getWebhookLogsAction({
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
          result = await getWebhookLogsAction({
            page: targetPage,
            limit: targetLimit,
            ...params,
          });
        }

        if (result.success && result.data) {
          set({
            webhookLogs: result.data.data,
            meta: result.data.meta,
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
    setPage: (page: number) => {
      get().fetchWebhookLogs({ page });
    },
    setLimit: (limit: number) => {
      get().fetchWebhookLogs({ limit, page: 1 });
    },
  }),
);
