import type { FC } from 'react';

import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { formatMonth } from '@/components/roadmap/QuestLine';
import type { RoadmapPhase } from '@/config/roadmap';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';

/** Shipped phases, newest first. */
export const ShippedList: FC<{ phases: RoadmapPhase[] }> = ({ phases }) => (
  <ol className="flex flex-col border-t border-border">
    {[...phases].reverse().map(phase => (
      <li
        className="grid gap-2 border-b border-border py-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6"
        key={phase.codename}
      >
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ok">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
            {phase.shippedAt ? formatMonth(phase.shippedAt) : 'Shipped'}
          </span>
          {!!phase.release && (
            <a
              className="w-fit font-mono text-xs text-accent-text"
              href={githubRepositoryUrl(`/releases/tag/${phase.release}`)}
              rel="noreferrer"
              target="_blank"
            >
              {phase.release}
            </a>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-xl font-bold tracking-[-0.02em] text-text">
            {phase.codename}
          </h3>
          <p className="max-w-[72ch] text-sm text-text-2">{phase.summary}</p>
        </div>
      </li>
    ))}
  </ol>
);
