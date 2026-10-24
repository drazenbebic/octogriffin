'use client';

import type { FC } from 'react';

import {
  triggerGridColumns,
  TriggerRow,
} from '@/components/dashboard/TriggerRow';
import type { TriggerWithRepos } from '@/types/triggers';
import { cn } from '@/utils/cn';

export type TriggersTableProps = {
  onDelete?: (trigger: TriggerWithRepos) => void;
  onEdit?: (trigger: TriggerWithRepos) => void;
  recentlyCreated: string[];
  totalRepos: number;
  triggers: TriggerWithRepos[];
};

export const TriggersTable: FC<TriggersTableProps> = ({
  onDelete,
  onEdit,
  recentlyCreated,
  totalRepos,
  triggers,
}) => (
  <div className="overflow-x-auto">
    <div className="min-w-[720px]">
      <div
        className={cn(
          triggerGridColumns,
          'border-b border-border bg-sunken px-[18px] py-2.5 text-xs font-semibold text-muted',
        )}
      >
        <span>Trigger</span>
        <span>Repositories</span>
        <span>Difficulty</span>
        <span>Attr.</span>
        <span>Effect</span>
        <span className="text-right">Active</span>
      </div>
      {triggers.map(trigger => (
        <TriggerRow
          isNew={recentlyCreated.includes(trigger.uuid)}
          key={trigger.uuid}
          onDelete={onDelete}
          onEdit={onEdit}
          totalRepos={totalRepos}
          trigger={trigger}
        />
      ))}
    </div>
  </div>
);
