'use client';

import Link from 'next/link';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { Globe02Icon, SquareLock01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import type { ConnectedRepository } from '@/actions/getConnectedReposAction';
import { getConnectedReposAction } from '@/actions/getConnectedReposAction';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Tooltip } from '@/components/ui/Tooltip';
import { useTriggersStore } from '@/store/useTriggersStore';
import type { TriggerWithRepos } from '@/types/triggers';
import { githubAppUrl } from '@/utils/githubAppUrl';
import { countTriggersByRepository } from '@/utils/stats';

const MAX_VISIBLE = 3;

export const RepositoryListCard: FC = () => {
  const [repos, setRepos] = useState<ConnectedRepository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const triggers = useTriggersStore(state => state.triggers);
  const total = useTriggersStore(state => state.meta.total);

  useEffect(() => {
    const fetchConnectedRepos = async () => {
      try {
        const { data } = await getConnectedReposAction();
        setRepos(data ?? []);
      } catch (error) {
        console.error('Failed to fetch connected repositories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchConnectedRepos();
  }, []);

  // Triggers are paginated, so counts are only exact once all are loaded
  const counts = useMemo(
    () =>
      triggers.length >= total
        ? countTriggersByRepository(triggers as TriggerWithRepos[])
        : null,
    [triggers, total],
  );

  const visibleRepos = isExpanded ? repos : repos.slice(0, MAX_VISIBLE);
  const hiddenCount = repos.length - MAX_VISIBLE;

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-[18px] shadow-e1">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-text">Repositories</h2>
        <Link
          className="text-[13px] font-semibold text-accent-text"
          href={githubAppUrl()}
          rel="noreferrer"
          target="_blank"
        >
          Manage on GitHub
        </Link>
      </div>

      {isLoading ? (
        <ul className="flex flex-col">
          {[0, 1, 2].map(i => (
            <li className="border-t border-line py-2.5" key={i}>
              <Skeleton className="h-4 w-40" />
            </li>
          ))}
        </ul>
      ) : repos.length > 0 ? (
        <ul className="flex flex-col">
          {visibleRepos.map(repo => {
            const count = counts?.get(repo.uuid) ?? 0;

            return (
              <li
                className="flex items-center justify-between gap-3 border-t border-line py-2"
                key={repo.id}
              >
                <a
                  className="flex min-w-0 items-center gap-2.5 text-[13px] font-medium text-text hover:text-accent-text"
                  href={repo.htmlUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Tooltip
                    content={
                      repo.private ? 'Private repository' : 'Public repository'
                    }
                  >
                    <span className="shrink-0 text-muted">
                      <HugeiconsIcon
                        aria-label={repo.private ? 'Private' : 'Public'}
                        icon={repo.private ? SquareLock01Icon : Globe02Icon}
                        size={16}
                      />
                    </span>
                  </Tooltip>
                  <span className="truncate">{repo.fullName}</span>
                </a>
                {count > 0 && (
                  <span className="shrink-0 text-xs text-muted">
                    {count} {count === 1 ? 'trigger' : 'triggers'}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-md border border-dashed border-border-strong p-4 text-center text-sm text-text-2">
          Install the GitHub App on a repository to start earning rewards.
        </p>
      )}

      {hiddenCount > 0 && (
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          size="sm"
          variant="ghost"
        >
          {isExpanded ? 'Show fewer' : `Show ${hiddenCount} more`}
        </Button>
      )}
    </section>
  );
};
