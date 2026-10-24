'use client';

import type { FC } from 'react';

import { toast } from 'sonner';

import { EventId } from '@/components/ui/EventId';
import { Timestamp } from '@/components/ui/Timestamp';
import { Tooltip } from '@/components/ui/Tooltip';
import type { WebhookLogsModel } from '@/generated/prisma/models/WebhookLogs';
import { useEventIcon } from '@/hooks/useEventIcon';
import { getEventLabel } from '@/utils/githubEvents';

const TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  hour12: false,
  minute: '2-digit',
};

type WebhookLogsListItemProps = {
  log: WebhookLogsModel;
};

export const WebhookLogsListItem: FC<WebhookLogsListItemProps> = ({ log }) => {
  const icon = useEventIcon(log.event, { size: 18 });

  const copyDeliveryId = async () => {
    await navigator.clipboard.writeText(log.deliveryUuid);
    toast.success('Delivery ID copied');
  };

  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-line px-[18px] py-3 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-fill text-text-2">
          {icon}
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-semibold text-text">
            {getEventLabel(log.event)}
          </span>
          <span className="flex min-w-0 items-center gap-2 text-xs text-muted">
            <EventId className="bg-transparent px-0" event={log.event} />
            <Tooltip content="Copy delivery ID">
              <button
                aria-label={`Copy delivery ID ${log.deliveryUuid}`}
                className="min-w-0 cursor-pointer truncate rounded-sm font-mono text-faint transition-colors duration-[var(--dur-fast)] hover:text-text-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                onClick={copyDeliveryId}
                type="button"
              >
                {log.deliveryUuid}
              </button>
            </Tooltip>
          </span>
        </div>
      </div>

      <Timestamp
        className="font-mono text-xs text-muted"
        date={new Date(log.createdAt)}
        options={TIME_OPTIONS}
      />
    </li>
  );
};
