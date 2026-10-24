'use client';

import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';

import {
  Add01Icon,
  RefreshIcon,
  Search01Icon,
  ZapIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { TriggersTable } from '@/components/dashboard/TriggersTable';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { Button } from '@/components/ui/Button';
import { ButtonIcon } from '@/components/ui/ButtonIcon';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { recipes } from '@/config/recipes';
import type { TriggersModel } from '@/generated/prisma/models/Triggers';
import { useRepositories } from '@/hooks/useRepositories';
import { useTriggersStore } from '@/store/useTriggersStore';
import type { TriggerWithRepos } from '@/types/triggers';
import { filterTriggers } from '@/utils/filterTriggers';

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
  const hasLoaded = useTriggersStore(state => state.hasLoaded);
  const recentlyCreated = useTriggersStore(state => state.recentlyCreated);
  const fetchTriggers = useTriggersStore(state => state.fetchTriggers);
  const setPage = useTriggersStore(state => state.setPage);
  const setLimit = useTriggersStore(state => state.setLimit);
  const repositories = useRepositories();
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchTriggers({ page: 1 });
  }, [fetchTriggers]);

  const visibleTriggers = useMemo(
    () => filterTriggers(triggers as TriggerWithRepos[], query),
    [triggers, query],
  );

  // Until the first load finishes there's nothing to say about emptiness
  const isPending = isLoading || !hasLoaded;

  if (!isPending && triggers.length === 0) {
    return (
      <div className="mist flex flex-col items-center gap-2 rounded-lg border border-border px-6 py-14 text-center">
        <span className="mb-2 grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-muted">
          <HugeiconsIcon icon={ZapIcon} size={22} />
        </span>
        <h3 className="text-base font-semibold text-text">No triggers yet</h3>
        <p className="max-w-sm text-sm text-text-2">
          A trigger scores a Habitica habit whenever something happens on
          GitHub. Start with a recipe:
        </p>
        <div className="mt-4 flex w-full max-w-md flex-col gap-2">
          {recipes.slice(0, 3).map(recipe => (
            <RecipeCard key={recipe.slug} layout="row" recipe={recipe} />
          ))}
        </div>
        <Button className="mt-3" onClick={onOpenCreateAction} variant="ghost">
          <HugeiconsIcon icon={Add01Icon} size={16} />
          Or build your own trigger
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-end gap-2 xl:absolute xl:top-1 xl:right-0">
        <label className="flex h-9 w-full items-center gap-2 rounded-md border border-border-strong bg-sunken px-2.5 text-muted focus-within:border-accent focus-within:ring-[3px] focus-within:ring-ring sm:w-56">
          <HugeiconsIcon icon={Search01Icon} size={16} />
          <input
            aria-label="Filter triggers"
            className="w-full bg-transparent text-[13px] text-text outline-none placeholder:text-faint"
            onChange={event => setQuery(event.target.value)}
            placeholder="Filter triggers"
            type="search"
            value={query}
          />
        </label>
        <ButtonIcon
          icon={RefreshIcon}
          label="Refresh triggers"
          onClick={() => fetchTriggers()}
          size="sm"
          variant="secondary"
        />
        <Button onClick={onOpenCreateAction} size="sm">
          <HugeiconsIcon icon={Add01Icon} size={16} />
          New trigger
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-e1">
        {isPending ? (
          <div className="flex flex-col">
            {[...Array(meta.limit || 5)].map((_, i) => (
              <div
                className="flex items-center gap-3 border-b border-line px-[18px] py-3.5 last:border-b-0"
                key={i}
              >
                <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-5 w-9 rounded-full" />
              </div>
            ))}
          </div>
        ) : visibleTriggers.length > 0 ? (
          <TriggersTable
            onDelete={onOpenDeleteAction}
            onEdit={onOpenEditAction}
            recentlyCreated={recentlyCreated}
            totalRepos={repositories.length}
            triggers={visibleTriggers}
          />
        ) : (
          <p className="px-[18px] py-10 text-center text-sm text-text-2">
            No triggers on this page match “{query.trim()}”.
          </p>
        )}
      </div>

      <Pagination meta={meta} onLimitChange={setLimit} onPageChange={setPage} />
    </div>
  );
};
