'use client';

import type { FC } from 'react';
import { useEffect } from 'react';

import { Activity04Icon, RefreshIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { WebhookLogsListItem } from '@/components/dashboard/WebhookLogsListItem';
import { Button } from '@/components/ui/Button';
import { ButtonIcon } from '@/components/ui/ButtonIcon';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { useWebhookLogsStore } from '@/store/useWebhookLogsStore';
import { groupLogsByDay } from '@/utils/groupLogsByDay';

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
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-e1">
        {[...Array(meta.limit || 5)].map((_, i) => (
          <div
            className="flex items-center gap-3 border-b border-line px-[18px] py-3 last:border-b-0"
            key={i}
          >
            <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </div>
    );
  }

  if (webhookLogs.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="mist flex flex-col items-center gap-2 rounded-lg border border-border px-6 py-14 text-center">
          <span className="mb-2 grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-muted">
            <HugeiconsIcon icon={Activity04Icon} size={22} />
          </span>
          <h3 className="text-base font-semibold text-text">No activity yet</h3>
          <p className="max-w-sm text-sm text-text-2">
            GitHub events from your repositories show up here as soon as they
            arrive.
          </p>
          <Button
            className="mt-2"
            onClick={() => fetchWebhookLogs()}
            size="sm"
            variant="secondary"
          >
            Check again
          </Button>
        </div>
      </div>
    );
  }

  const groups = groupLogsByDay(webhookLogs, new Date());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <ButtonIcon
          icon={RefreshIcon}
          label="Refresh history"
          onClick={() => fetchWebhookLogs()}
          size="sm"
          variant="secondary"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-e1">
        {groups.map(group => (
          <section aria-label={group.label} key={group.label}>
            <h3 className="border-b border-border bg-sunken px-[18px] py-2 text-xs font-semibold text-muted">
              {group.label}
            </h3>
            <ul>
              {group.logs.map(log => (
                <WebhookLogsListItem key={log.uuid} log={log} />
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Pagination meta={meta} onLimitChange={setLimit} onPageChange={setPage} />
    </div>
  );
};
