import type { FC } from 'react';

import { Add01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Avatar } from '@/components/ui/Avatar';
import { Heading } from '@/components/ui/Heading';
import type { MonthlySponsor, MonthlyTierId } from '@/config/sponsors';
import { githubSponsorsUrl, sponsorsByTier } from '@/config/sponsors';
import { cn } from '@/utils/cn';

const EMPTY_SEATS = 4;

const listStyles: Record<MonthlyTierId, string> = {
  coffee: 'gap-x-4 gap-y-2 text-sm text-text-2',
  feature: 'gap-6 text-base text-text',
  fuel: 'gap-x-5 gap-y-3 text-sm text-text',
};

const SponsorLink: FC<{ sponsor: MonthlySponsor }> = ({ sponsor }) => {
  const { login, name, tierId } = sponsor;

  return (
    <a
      className="flex items-center gap-3 font-semibold hover:text-accent-text"
      href={`https://github.com/${login}`}
      rel="noreferrer"
      target="_blank"
    >
      {tierId !== 'coffee' && (
        <Avatar
          alt=""
          fallback={name.slice(0, 1)}
          size={tierId === 'feature' ? 'lg' : 'sm'}
          src={`https://avatars.githubusercontent.com/${login}`}
        />
      )}
      {name}
    </a>
  );
};

/** Every monthly sponsor, grouped by tier; the bigger the tier, the bigger the seat. */
export const SponsorParty: FC<{ sponsors: MonthlySponsor[] }> = ({
  sponsors,
}) => {
  const groups = sponsorsByTier(sponsors);

  return (
    <section
      aria-labelledby="sponsor-party"
      className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-8"
    >
      <div className="flex flex-col gap-1.5">
        <Heading id="sponsor-party" level={2} size="h3">
          The party
        </Heading>
        <p className="text-text-2">
          Everyone who sponsors monthly, here and in the README. The bigger the
          tier, the bigger the seat.
        </p>
      </div>

      {groups.length > 0 ? (
        groups.map(({ sponsors: members, tier }) => (
          <div className="flex flex-col gap-3" key={tier.id}>
            <Heading level={3} size="h4">
              {tier.name}
            </Heading>
            <ul
              className={cn(
                'flex flex-wrap',
                listStyles[tier.id as MonthlyTierId],
              )}
            >
              {members.map(member => (
                <li key={member.login}>
                  <SponsorLink sponsor={member} />
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div aria-hidden="true" className="flex shrink-0 gap-2">
            {Array.from({ length: EMPTY_SEATS }, (_, index) => (
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-dashed border-faint text-accent-text first:border-accent-text first:bg-accent-soft"
                key={index}
              >
                {index === 0 && <HugeiconsIcon icon={Add01Icon} size={20} />}
              </span>
            ))}
          </div>
          <p className="text-text-2">
            No one has joined yet.{' '}
            <a
              className="font-semibold text-accent-text hover:underline"
              href={githubSponsorsUrl}
              rel="noreferrer"
              target="_blank"
            >
              Take the first seat
            </a>
          </p>
        </div>
      )}
    </section>
  );
};
