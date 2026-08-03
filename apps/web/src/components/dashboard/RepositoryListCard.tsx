'use client';

import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';

import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  GithubIcon,
  Globe02Icon,
  SquareLock01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { getConnectedReposAction } from '@/actions/getConnectedReposAction';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CardBody } from '@/components/ui/CardBody';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils/cn';
import { githubAppUrl } from '@/utils/githubAppUrl';

type RepoItem = Awaited<ReturnType<typeof getConnectedReposAction>>[number];

export const RepositoryListCard: FC = () => {
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchConnectedRepos = async () => {
      try {
        const data = await getConnectedReposAction();
        setRepos(data);
      } catch (error) {
        console.error('Failed to fetch connected repositories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnectedRepos();
  }, []);

  const MAX_VISIBLE = 3;
  const visibleRepos = isExpanded ? repos : repos.slice(0, MAX_VISIBLE);
  const hasHiddenItems = repos.length > MAX_VISIBLE;

  return (
    <Card className="bg-slate-50 dark:bg-slate-900/50" variant="outlined">
      <CardBody>
        <div className="mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <HugeiconsIcon icon={GithubIcon} size={20} />
          <Heading level={3} size="base">
            Connected Repositories
          </Heading>
        </div>

        <div className="flex flex-col gap-3">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <div
                  className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800"
                  key={i}
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              ))}
            </>
          ) : repos.length > 0 ? (
            <>
              {visibleRepos.map(repo => (
                <Link
                  className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md dark:bg-slate-900 dark:ring-slate-800 dark:hover:bg-slate-800/50"
                  href={repo.htmlUrl}
                  key={repo.id}
                  rel="noreferrer"
                  target="_blank"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={cn(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg',
                        {
                          'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400':
                            repo.private,
                          'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400':
                            !repo.private,
                        },
                      )}
                      title={
                        repo.private
                          ? 'Private Repository'
                          : 'Public Repository'
                      }
                    >
                      {repo.private ? (
                        <HugeiconsIcon
                          className="h-4 w-4"
                          icon={SquareLock01Icon}
                        />
                      ) : (
                        <HugeiconsIcon className="h-4 w-4" icon={Globe02Icon} />
                      )}
                    </div>

                    <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                      {repo.name}
                    </span>
                  </div>
                </Link>
              ))}

              {hasHiddenItems && (
                <Button
                  className="mt-1 w-full text-slate-500"
                  onClick={() => setIsExpanded(!isExpanded)}
                  size="sm"
                  variant="secondary"
                >
                  {isExpanded ? (
                    <>
                      <HugeiconsIcon
                        className="mr-2"
                        icon={ArrowUp01Icon}
                        size={16}
                      />
                      Show Less
                    </>
                  ) : (
                    <>
                      <HugeiconsIcon
                        className="mr-2"
                        icon={ArrowDown01Icon}
                        size={16}
                      />
                      Show {repos.length - MAX_VISIBLE} More
                    </>
                  )}
                </Button>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
              No repositories found in this installation.
            </div>
          )}

          <Link
            className="group mt-2 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-violet-900/50 dark:hover:bg-violet-950/30 dark:hover:text-violet-400"
            href={githubAppUrl()}
            rel="noreferrer"
            target="_blank"
          >
            <span>+ Manage Repositories</span>
          </Link>
        </div>

        <Content className="mt-4" size="sm">
          Install the GitHub App on your repositories to start tracking commits.
        </Content>
      </CardBody>
    </Card>
  );
};
