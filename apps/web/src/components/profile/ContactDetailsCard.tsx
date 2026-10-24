import type { FC } from 'react';

import {
  Building03Icon,
  GithubIcon,
  Globe02Icon,
  Location01Icon,
  Mail01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Heading } from '@/components/ui/Heading';
import type { UserProfile } from '@/types/profile';
import { cn } from '@/utils/cn';

import { DetailRow } from './DetailRow';

export type ContactDetailsCardProps = {
  className?: string;
  profile: UserProfile;
};

export const ContactDetailsCard: FC<ContactDetailsCardProps> = ({
  className,
  profile,
}) => {
  return (
    <section
      className={cn(
        'flex flex-col rounded-xl border border-border bg-surface shadow-e1',
        className,
      )}
    >
      <div className="flex flex-col gap-0.5 border-b border-border px-6 py-5">
        <Heading level={2} size="h3">
          GitHub details
        </Heading>
        <p className="text-[13px] text-text-2">
          Public information from your GitHub profile.
        </p>
      </div>
      <dl className="flex flex-col px-6">
        <DetailRow
          fallback="Not public"
          icon={<HugeiconsIcon icon={Mail01Icon} size={18} />}
          label="Email"
          value={profile.email}
        />
        <DetailRow
          fallback="Not set"
          icon={<HugeiconsIcon icon={Building03Icon} size={18} />}
          label="Company"
          value={profile.company}
        />
        <DetailRow
          fallback="Not set"
          icon={<HugeiconsIcon icon={Location01Icon} size={18} />}
          label="Location"
          value={profile.location}
        />
        <DetailRow
          fallback="Not set"
          icon={<HugeiconsIcon icon={Globe02Icon} size={18} />}
          isLink
          label="Website"
          value={profile.website}
        />
        <DetailRow
          icon={<HugeiconsIcon icon={GithubIcon} size={18} />}
          isLink
          label="GitHub profile"
          value={profile.githubUrl}
        />
      </dl>
    </section>
  );
};
