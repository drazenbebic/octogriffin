'use client';

import type { FC } from 'react';

import { FavouriteIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { useSponsorChoice } from '@/components/sponsors/SponsorChoice';
import {
  formatMoney,
  monthlySponsors,
  monthlyTotal,
  oneTimeThisMonth,
  upkeep,
  upkeepPercent,
} from '@/config/sponsors';
import { cn } from '@/utils/cn';

/**
 * This month's hosting as a health bar: recurring sponsorships, one-time
 * gifts, and in green what the tier picked below would add, in the visitor's
 * currency.
 */
export const UpkeepBar: FC<{ className?: string }> = ({ className }) => {
  const choice = useSponsorChoice();
  const tier = choice?.tier;
  const currency = choice?.currency ?? 'USD';
  const { covers, goal } = upkeep;
  const monthly = monthlyTotal();
  const covered = monthly + oneTimeThisMonth;
  const recurring = upkeepPercent(monthly, goal);
  const oneTime = Math.min(
    100 - recurring,
    upkeepPercent(oneTimeThisMonth, goal),
  );
  const preview = tier
    ? Math.min(100 - recurring - oneTime, upkeepPercent(tier.amount, goal))
    : 0;

  const coveredText = formatMoney(covered, currency);
  const goalText = formatMoney(goal, currency);

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-lg border border-white/10 bg-black/40 px-[18px] py-4 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]',
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="flex items-center gap-2 text-[15px] font-semibold">
          <HugeiconsIcon
            className="fill-[#ff6b7a] text-[#ff6b7a]"
            icon={FavouriteIcon}
            size={16}
          />
          Server health
        </span>
        <span className="text-[13px] text-white/75">
          {coveredText} of {goalText} a month
          {!!tier && (
            <span className="text-[#4cc38a]">
              {' '}
              +{formatMoney(tier.amount, currency)}
              {tier.id === 'once' ? ' once' : ''}
            </span>
          )}
        </span>
      </div>

      <div
        aria-label="Server health"
        aria-valuemax={goal}
        aria-valuemin={0}
        aria-valuenow={Math.min(covered, goal)}
        aria-valuetext={`${coveredText} of ${goalText} a month covered`}
        className="flex h-3 overflow-hidden rounded-full bg-white/12"
        role="meter"
      >
        <span className="bg-[#ff6b7a]" style={{ width: `${recurring}%` }} />
        <span className="bg-[#ff6b7a]/55" style={{ width: `${oneTime}%` }} />
        <span
          className="bg-[#4cc38a]/70 transition-[width] duration-[var(--dur-base)] ease-out"
          style={{ width: `${preview}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-white/70">
        <span>Pays for {covers}</span>
        <span className="ml-auto">
          {monthlySponsors.length === 1
            ? '1 sponsor'
            : `${monthlySponsors.length} sponsors`}
        </span>
      </div>
    </div>
  );
};
