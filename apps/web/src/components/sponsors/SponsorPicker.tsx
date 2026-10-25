'use client';

import type { FC } from 'react';

import {
  CheckmarkCircle02Icon,
  Coffee02Icon,
  FavouriteIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { useSponsorChoice } from '@/components/sponsors/SponsorChoice';
import { TriggerSentence } from '@/components/TriggerSentence';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import type { SponsorTierId } from '@/config/sponsors';
import {
  formatMoney,
  githubSponsorsUrl,
  kofiUrl,
  sponsorTiers,
} from '@/config/sponsors';
import { describeSponsorship } from '@/utils/describeSponsorship';

const external = (href: string) => (
  <a href={href} rel="noreferrer" target="_blank" />
);

/** Pick an amount, read what it does, then go and give it. */
export const SponsorPicker: FC = () => {
  const choice = useSponsorChoice();

  if (!choice) {
    return null;
  }

  const { currency, setTierId, tier } = choice;
  const isOnce = tier.id === 'once';
  const price = formatMoney(tier.amount, currency);

  const github = (
    <Button
      key="github"
      render={external(githubSponsorsUrl)}
      size="lg"
      variant={isOnce ? 'secondary' : 'primary'}
    >
      <HugeiconsIcon icon={FavouriteIcon} size={20} />
      {isOnce ? 'Give once on GitHub' : `Sponsor ${price} a month`}
    </Button>
  );
  const kofi = (
    <Button
      key="kofi"
      render={external(kofiUrl)}
      size="lg"
      variant={isOnce ? 'primary' : 'secondary'}
    >
      <HugeiconsIcon icon={Coffee02Icon} size={20} />
      Buy me a coffee
    </Button>
  );

  return (
    <section
      aria-labelledby="sponsor-picker"
      className="grid items-start gap-12 lg:grid-cols-2"
    >
      <div className="flex flex-col gap-5">
        <Heading id="sponsor-picker" level={2} size="h1">
          Pick how you help
        </Heading>
        <p className="max-w-[46ch] text-text-2">
          Every sponsorship reads like a trigger. Choose a monthly amount or a
          one-time gift and watch the health bar above.
        </p>
        <SegmentedControl<SponsorTierId>
          className="max-w-[420px]"
          label="Sponsorship"
          onChange={setTierId}
          options={sponsorTiers.map(option => ({
            label:
              option.id === 'once'
                ? 'Once'
                : formatMoney(option.amount, currency),
            name: option.name,
            value: option.id,
          }))}
          showLabel={false}
          size="lg"
          value={tier.id}
        />
        <ul
          className="flex animate-fade-in flex-col gap-3 text-[15px]"
          key={tier.id}
        >
          {tier.perks.map(perk => (
            <li className="flex gap-3 text-text-2" key={perk}>
              <HugeiconsIcon
                className="mt-0.5 shrink-0 text-accent-text"
                icon={CheckmarkCircle02Icon}
                size={20}
              />
              {perk}
            </li>
          ))}
        </ul>
      </div>

      <figure className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-8 shadow-e2">
        <figcaption className="text-[13px] font-semibold text-muted">
          {tier.name}
        </figcaption>
        {/* Room for the longest sentence, so the page below doesn't jump */}
        <div aria-live="polite" className="sm:min-h-[182px]">
          <TriggerSentence
            className="animate-fade-in"
            key={tier.id}
            parts={describeSponsorship(tier, currency)}
            size="lg"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          {isOnce ? [kofi, github] : [github, kofi]}
        </div>
        <span className="text-[13px] text-muted">
          GitHub Sponsors and Ko-fi both take monthly and one-time support.
          GitHub charges in US dollars and Ko-fi in euros.
        </span>
      </figure>
    </section>
  );
};
