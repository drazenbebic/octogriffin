import type { FC } from 'react';

import { cn } from '@/utils/cn';
import { getDifficulty } from '@/utils/difficulty';

export type HabitPreviewProps = {
  direction: 'down' | 'up';
  priority: number;
  title: string;
};

/**
 * A rough idea of the habit in Habitica, so the effect of the settings is
 * visible before saving. Habitica draws the real card.
 */
export const HabitPreview: FC<HabitPreviewProps> = ({
  direction,
  priority,
  title,
}) => {
  const { stars } = getDifficulty(priority);
  const rewards = direction === 'up';

  return (
    <figure className="flex flex-col gap-2.5">
      <div
        aria-hidden="true"
        className="flex overflow-hidden rounded-[6px] bg-white text-[#34313a] shadow-[0_2px_6px_rgb(0_0_0/0.25)]"
      >
        <span
          className={cn(
            'grid w-10 shrink-0 place-items-center',
            rewards ? 'bg-[#ffb445]' : 'bg-[#edecee]',
          )}
        >
          <span
            className={cn(
              'grid h-6 w-6 place-items-center rounded-full font-bold',
              rewards ? 'bg-white/35 text-white' : 'bg-white text-[#c3c0c7]',
            )}
          >
            +
          </span>
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1 px-3 py-2.5">
          <span className="truncate text-sm font-semibold">
            {title || 'Your habit'}
          </span>
          <span className="text-[11px] text-[#878190]">
            {stars ? '★'.repeat(stars) : '·'} Added by Octogriffin
          </span>
        </span>
        <span
          className={cn(
            'grid w-10 shrink-0 place-items-center',
            rewards ? 'bg-[#edecee]' : 'bg-[#f74e52]',
          )}
        >
          <span
            className={cn(
              'grid h-6 w-6 place-items-center rounded-full font-bold',
              rewards ? 'bg-white text-[#c3c0c7]' : 'bg-white/35 text-white',
            )}
          >
            −
          </span>
        </span>
      </div>
      <figcaption className="text-xs text-muted">
        Approximation. Habitica draws the real card.
      </figcaption>
    </figure>
  );
};
