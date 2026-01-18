'use client';

import { FC, useEffect } from 'react';

import { Activity04Icon, RefreshIcon } from 'hugeicons-react';

import { WebhookLogsListItem } from '@/components/dashboard/WebhookLogsListItem';
import { ButtonIcon } from '@/components/ui/ButtonIcon';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { useWebhookLogsStore } from '@/store/useWebhookLogsStore';

export const WebhookLogsList: FC = () => {
  const webhookLogs = useWebhookLogsStore(state => state.webhookLogs);
  const meta = useWebhookLogsStore(state => state.meta);
  const isLoading = useWebhookLogsStore(state => state.isLoading);
  const fetchWebhookLogs = useWebhookLogsStore(state => state.fetchWebhookLogs);
  const setPage = useWebhookLogsStore(state => state.setPage);
  const setLimit = useWebhookLogsStore(state => state.setLimit);

  useEffect(() => {
    fetchWebhookLogs({ page: 1 });
  }, [fetchWebhookLogs]);

  if (isLoading) {
    const skeletonCount =
      webhookLogs.length > 0 && webhookLogs.length < meta.limit
        ? webhookLogs.length
        : meta.limit || 5;

    return (
      <div className="flex h-full flex-col gap-4">
        <div className="mb-2 flex justify-end">
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>

        {[...Array(skeletonCount)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-3 w-48" />
              </div>
            </div>

            <div className="flex shrink-0 sm:justify-end">
              <Skeleton className="h-4 w-32 sm:w-24" />
            </div>
          </div>
        ))}

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 py-4 sm:flex-row">
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (webhookLogs.length > 0) {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="flex justify-end">
          <ButtonIcon
            size="sm"
            variant="secondary"
            onClick={() => fetchWebhookLogs()}
            aria-label="Refresh webhook logs"
          >
            <RefreshIcon size={16} />
          </ButtonIcon>
        </div>

        <div className="flex flex-col gap-4">
          {webhookLogs.map(log => (
            <WebhookLogsListItem key={log.uuid} log={log} />
          ))}
        </div>

        <Pagination
          meta={meta}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="mb-2 flex justify-end">
        <ButtonIcon
          size="sm"
          variant="ghost"
          onClick={() => fetchWebhookLogs()}
          aria-label="Refresh logs"
        >
          <RefreshIcon size={16} />
        </ButtonIcon>
      </div>
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-100">
          <Activity04Icon className="text-slate-400" size={24} />
        </div>
        <h3 className="mb-1 text-base font-semibold text-slate-900">
          No Activity Recorded
        </h3>
        <p className="max-w-sm text-sm text-slate-500">
          We haven&#39;t received any webhook events from GitHub for your
          account yet.
        </p>
      </div>
    </div>
  );
};
