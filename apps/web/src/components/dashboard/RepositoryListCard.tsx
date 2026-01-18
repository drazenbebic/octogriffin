'use client';

import React, { FC, useEffect, useState } from 'react';
import Link from 'next/link';

import clsx from 'clsx';
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  GithubIcon,
  Globe02Icon,
  SquareLock01Icon,
} from 'hugeicons-react';

import { getConnectedReposAction } from '@/actions/getConnectedReposAction';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CardBody } from '@/components/ui/CardBody';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { Skeleton } from '@/components/ui/Skeleton';
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
    <Card variant="outlined" className="bg-slate-50">
      <CardBody>
        <div className="mb-4 flex items-center gap-2 text-slate-900">
          <GithubIcon size={20} />
          <Heading level={3} size="base">
            Connected Repositories
          </Heading>
        </div>

        <div className="flex flex-col gap-3">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100"
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
                  key={repo.id}
                  className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md"
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={clsx(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg',
                        {
                          'bg-amber-100 text-amber-600': repo.private,
                          'bg-emerald-100 text-emerald-600': !repo.private,
                        },
                      )}
                      title={
                        repo.private
                          ? 'Private Repository'
                          : 'Public Repository'
                      }
                    >
                      {repo.private ? (
                        <SquareLock01Icon className="h-4 w-4" />
                      ) : (
                        <Globe02Icon className="h-4 w-4" />
                      )}
                    </div>

                    <span className="truncate text-sm font-medium text-slate-700">
                      {repo.name}
                    </span>
                  </div>
                </Link>
              ))}

              {hasHiddenItems && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-1 w-full text-slate-500"
                >
                  {isExpanded ? (
                    <>
                      <ArrowUp01Icon size={16} className="mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ArrowDown01Icon size={16} className="mr-2" />
                      Show {repos.length - MAX_VISIBLE} More
                    </>
                  )}
                </Button>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-sm text-slate-500">
              No repositories found in this installation.
            </div>
          )}

          <Link
            href={githubAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="group mt-2 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
          >
            <span>+ Manage Repositories</span>
          </Link>
        </div>

        <Content size="sm" className="mt-4">
          Install the GitHub App on your repositories to start tracking commits.
        </Content>
      </CardBody>
    </Card>
  );
};
