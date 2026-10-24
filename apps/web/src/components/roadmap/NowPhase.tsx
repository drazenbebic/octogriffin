import type { FC } from 'react';

import { ThumbsUpIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import type { RoadmapPhase } from '@/config/roadmap';
import { cn } from '@/utils/cn';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';

/** The phase being built, on the one grain surface of the page. */
export const NowPhase: FC<{ phase: RoadmapPhase }> = ({ phase }) => (
  <section
    aria-labelledby="now-phase"
    className="arcane grid gap-10 rounded-2xl p-8 sm:p-12 md:grid-cols-2"
  >
    <div className="flex flex-col gap-3.5">
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[13px] font-semibold">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-[#f5b544]"
        />
        <span>Now in the forge</span>
      </span>
      <h2
        className="font-display text-[44px] leading-none font-extrabold tracking-[-0.02em]"
        id="now-phase"
      >
        {phase.codename}
      </h2>
      <p className="max-w-[40ch] text-white/80">{phase.summary}</p>
    </div>

    <ul className="flex flex-col gap-2.5">
      {phase.items.map(item => (
        <li
          className="flex flex-col gap-1.5 rounded-lg border border-white/10 bg-black/40 px-[18px] py-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]"
          key={item.title}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold">{item.title}</h3>
            <span
              className={cn(
                'rounded-sm px-2 py-0.5 text-xs font-semibold',
                item.status === 'in-progress'
                  ? 'bg-[#f5b544] text-griffin-900'
                  : 'bg-white/15 text-white',
              )}
            >
              {item.status === 'in-progress' ? 'In progress' : 'Planned'}
            </span>
          </div>
          <p className="text-sm text-white/75">{item.description}</p>
          {!!item.issue && (
            <a
              className="flex w-fit items-center gap-1.5 text-[13px] text-griffin-200 hover:text-white"
              href={githubRepositoryUrl(`/issues/${item.issue}`)}
              rel="noreferrer"
              target="_blank"
            >
              <HugeiconsIcon icon={ThumbsUpIcon} size={14} />
              Vote on GitHub
              <span className="font-mono text-xs opacity-80">
                #{item.issue}
              </span>
            </a>
          )}
        </li>
      ))}
    </ul>
  </section>
);
