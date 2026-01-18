'use client';

import { FC } from 'react';

import clsx from 'clsx';
import { format } from 'date-fns';
import {
  GitCommitIcon,
  GitPullRequestIcon,
  PackageIcon,
  SourceCodeIcon,
  ZapIcon,
} from 'hugeicons-react';

import { WebhookLogsModel } from '@/generated/prisma/models/WebhookLogs';

const getEventConfig = (event: string) => {
  if (event.includes('push')) {
    return {
      icon: <GitCommitIcon size={18} />,
      label: 'Push Event',
      color: 'text-violet-600 bg-violet-50',
    };
  }
  if (event.includes('pull_request')) {
    return {
      icon: <GitPullRequestIcon size={18} />,
      label: 'Pull Request',
      color: 'text-blue-600 bg-blue-50',
    };
  }
  if (event.includes('issue')) {
    return {
      icon: <SourceCodeIcon size={18} />,
      label: 'Issue Event',
      color: 'text-amber-600 bg-amber-50',
    };
  }
  return {
    icon: <ZapIcon size={18} />,
    label: event,
    color: 'text-slate-600 bg-slate-100',
  };
};

type WebhookLogsListItemProps = {
  log: WebhookLogsModel;
};

export const WebhookLogsListItem: FC<WebhookLogsListItemProps> = ({ log }) => {
  const config = getEventConfig(log.event);
  const formattedDate = format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss');

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between transition-all hover:shadow-md">
      <div className="flex items-start gap-4 overflow-hidden">
        <div
          className={clsx(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            config.color,
          )}
        >
          {config.icon}
        </div>

        <div className="space-y-1 overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">{config.label}</span>
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              {log.event}
            </span>
          </div>

          <div
            className="flex items-center gap-1.5 text-xs text-slate-500"
            title="Delivery UUID"
          >
            <PackageIcon size={14} className="shrink-0" />
            <span className="truncate font-mono">{log.deliveryUuid}</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 text-xs font-medium text-slate-400 sm:text-right">
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};
