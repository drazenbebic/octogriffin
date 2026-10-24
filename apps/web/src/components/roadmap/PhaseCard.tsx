import type { FC } from 'react';

import type { RoadmapPhase } from '@/config/roadmap';
import { cn } from '@/utils/cn';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';

/** A planned phase: solid for "next", dashed for "later" and "exploring". */
export const PhaseCard: FC<{ phase: RoadmapPhase }> = ({ phase }) => {
  const isNext = phase.status === 'next';

  return (
    <article
      className={cn(
        'flex flex-col gap-4 rounded-xl p-7',
        isNext
          ? 'border border-border bg-surface shadow-e1'
          : 'border-[1.5px] border-dashed border-border-strong',
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl font-bold tracking-[-0.02em] text-text">
          {phase.codename}
        </h3>
        {!isNext && (
          <span className="text-[13px] font-semibold text-muted capitalize">
            {phase.status}
          </span>
        )}
      </div>
      <p className="text-sm text-text-2">{phase.summary}</p>
      <ul className="flex flex-col">
        {phase.items.map(item => (
          <li
            className="flex flex-col gap-0.5 border-t border-line py-3"
            key={item.title}
          >
            <div className="flex justify-between gap-4">
              <span className="text-[15px] font-semibold text-text">
                {item.title}
              </span>
              {!!item.issue && (
                <a
                  className="font-mono text-xs text-accent-text"
                  href={githubRepositoryUrl(`/issues/${item.issue}`)}
                  rel="noreferrer"
                  target="_blank"
                >
                  #{item.issue}
                </a>
              )}
            </div>
            <span className="text-sm text-text-2">{item.description}</span>
          </li>
        ))}
      </ul>
    </article>
  );
};
