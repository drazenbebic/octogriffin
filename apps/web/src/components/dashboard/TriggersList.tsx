'use client';

import { FC, useEffect } from 'react';

import { RefreshIcon, ZapIcon } from 'hugeicons-react';

import { TriggersListItem } from '@/components/dashboard/TriggersListItem';
import { Button } from '@/components/ui/Button';
import { ButtonIcon } from '@/components/ui/ButtonIcon';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { TriggersModel } from '@/generated/prisma/models/Triggers';
import { useTriggersStore } from '@/store/useTriggersStore';

export type TriggersListProps = {
  onOpenCreateAction?: () => void;
  onOpenDeleteAction?: (trigger: TriggersModel) => void;
  onOpenEditAction?: (trigger: TriggersModel) => void;
};

export const TriggersList: FC<TriggersListProps> = ({
  onOpenCreateAction,
  onOpenDeleteAction,
  onOpenEditAction,
}) => {
  const triggers = useTriggersStore(state => state.triggers);
  const meta = useTriggersStore(state => state.meta);
  const isLoading = useTriggersStore(state => state.isLoading);
  const fetchTriggers = useTriggersStore(state => state.fetchTriggers);
  const setPage = useTriggersStore(state => state.setPage);
  const setLimit = useTriggersStore(state => state.setLimit);

  useEffect(() => {
    fetchTriggers({ page: 1 });
  }, [fetchTriggers]);

  if (isLoading) {
    const skeletonCount =
      triggers.length > 0 && triggers.length < meta.limit
        ? triggers.length
        : meta.limit || 5;

    return (
      <div className="flex h-full flex-col gap-4">
        <div className="mb-2 flex justify-end gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>

        {[...Array(skeletonCount)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
              <div className="w-full">
                <Skeleton className="mb-2 h-5 w-32 sm:w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <Skeleton className="h-6 w-11 shrink-0 rounded-full" />{' '}
              <div className="hidden h-8 w-20 items-center gap-1 border-l border-slate-100 pl-4 sm:flex">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
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

  if (triggers.length > 0) {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="flex justify-end gap-2">
          <ButtonIcon
            size="sm"
            variant="secondary"
            onClick={() => fetchTriggers()}
            aria-label="Refresh triggers list"
          >
            <RefreshIcon size={16} />
          </ButtonIcon>
          <Button size="sm" onClick={onOpenCreateAction}>
            + New Trigger
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {triggers.map(trigger => (
            <TriggersListItem
              key={trigger.uuid}
              trigger={trigger}
              onOpenDeleteAction={onOpenDeleteAction}
              onOpenEditAction={onOpenEditAction}
            />
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
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-100">
          <ZapIcon className="text-slate-400" size={24} />
        </div>
        <h3 className="mb-1 text-base font-semibold text-slate-900">
          No triggers defined
        </h3>
        <p className="mb-6 max-w-sm text-sm text-slate-500">
          Create your first trigger to start earning XP automatically when you
          push code.
        </p>
        <Button onClick={onOpenCreateAction}>Create Trigger</Button>
      </div>
    </div>
  );
};
