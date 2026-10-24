import type { FC } from 'react';

import type { RoadmapPhase } from '@/config/roadmap';
import { cn } from '@/utils/cn';

const formatMonth = (yearMonth: string) =>
  new Date(`${yearMonth}-01T00:00:00`).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });

const whenLabel = (phase: RoadmapPhase) => {
  switch (phase.status) {
    case 'shipped':
      return phase.shippedAt
        ? `Shipped ${formatMonth(phase.shippedAt)}`
        : 'Shipped';
    case 'now':
      return 'In progress';
    case 'next':
      return 'Next';
    case 'later':
      return 'Later';
    default:
      return 'Exploring';
  }
};

/** Every phase as a stop on one line, filled up to the one being built. */
export const QuestLine: FC<{ phases: RoadmapPhase[] }> = ({ phases }) => (
  <ol
    aria-label="Roadmap phases"
    className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-y-6"
  >
    {phases.map((phase, index) => {
      const isLast = index === phases.length - 1;

      return (
        <li className="flex flex-col gap-2.5 pr-3" key={phase.codename}>
          <div className="flex items-center">
            <span
              aria-hidden="true"
              className={cn(
                'h-4 w-4 shrink-0 rounded-full',
                phase.status === 'shipped' && 'bg-ok',
                phase.status === 'now' &&
                  'bg-accent shadow-[0_0_0_5px_var(--accent-soft)]',
                phase.status === 'next' && 'border-2 border-accent bg-surface',
                (phase.status === 'later' || phase.status === 'exploring') &&
                  'border-2 border-dashed border-faint bg-surface',
              )}
            />
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn(
                  'ml-1 h-0.5 flex-1',
                  phase.status === 'shipped' ? 'bg-ok' : 'bg-border',
                )}
              />
            )}
          </div>
          <span
            className={cn(
              'font-display text-[17px] font-bold tracking-[-0.02em]',
              phase.status === 'now' ? 'text-accent-text' : 'text-text',
            )}
          >
            {phase.codename}
          </span>
          <span className="text-xs text-muted">{whenLabel(phase)}</span>
        </li>
      );
    })}
  </ol>
);

export { formatMonth };
