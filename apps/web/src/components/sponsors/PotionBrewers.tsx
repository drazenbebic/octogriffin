import type { FC } from 'react';

import { PotionIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Heading } from '@/components/ui/Heading';
import type { OneTimeSupporter } from '@/config/sponsors';
import { topOneTimeSupporters } from '@/config/sponsors';

/** Public one-time supporters, biggest total first, without amounts. */
export const PotionBrewers: FC<{ supporters: OneTimeSupporter[] }> = ({
  supporters,
}) => {
  const ranked = topOneTimeSupporters(supporters);

  return (
    <section
      aria-labelledby="potion-brewers"
      className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-8"
    >
      <div className="flex flex-col gap-1.5">
        <Heading id="potion-brewers" level={2} size="h3">
          Potion brewers
        </Heading>
        <p className="text-text-2">
          One-time gifts from the last 12 months, biggest first.
        </p>
      </div>

      {ranked.length > 0 ? (
        <ol className="flex flex-col gap-3">
          {ranked.map(supporter => (
            <li className="flex items-center gap-3" key={supporter.name}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-hp-soft text-hp">
                <HugeiconsIcon icon={PotionIcon} size={18} />
              </span>
              <span className="flex flex-col">
                {supporter.url ? (
                  <a
                    className="font-semibold text-text hover:text-accent-text"
                    href={supporter.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {supporter.name}
                  </a>
                ) : (
                  <span className="font-semibold text-text">
                    {supporter.name}
                  </span>
                )}
                <span className="text-[13px] text-muted">
                  via {supporter.via}
                </span>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-text-2">
          No potions yet. A one-time gift on Ko-fi or GitHub puts you here.
        </p>
      )}
    </section>
  );
};
