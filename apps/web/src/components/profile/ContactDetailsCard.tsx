import { FC } from 'react';

import {
  Building03Icon,
  GithubIcon,
  Globe02Icon,
  Location01Icon,
  Mail01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Card } from '@/components/ui/Card';
import { CardBody } from '@/components/ui/CardBody';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { UserProfile } from '@/types/profile';

import { DetailRow } from './DetailRow';

export type ContactDetailsCardProps = {
  profile: UserProfile;
  className?: string;
};

export const ContactDetailsCard: FC<ContactDetailsCardProps> = ({
  profile,
  className,
}) => {
  return (
    <Card className={className} variant="elevated">
      <CardBody>
        <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-2 dark:border-slate-800">
          <div>
            <Heading level={3} size="lg">
              Contact & Details
            </Heading>
            <Content className="mt-1" size="sm">
              Public information from your GitHub profile.
            </Content>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
          <DetailRow
            fallback="Not public"
            icon={<HugeiconsIcon icon={Mail01Icon} size={18} />}
            label="Email Address"
            value={profile.email}
          />
          <DetailRow
            fallback="Freelance"
            icon={<HugeiconsIcon icon={Building03Icon} size={18} />}
            label="Company"
            value={profile.company}
          />
          <DetailRow
            fallback="Unknown Realm"
            icon={<HugeiconsIcon icon={Location01Icon} size={18} />}
            label="Location"
            value={profile.location}
          />
          <DetailRow
            icon={<HugeiconsIcon icon={Globe02Icon} size={18} />}
            isLink
            label="Website"
            value={profile.website}
          />
          <DetailRow
            icon={<HugeiconsIcon icon={GithubIcon} size={18} />}
            isLink
            label="GitHub Profile"
            value={profile.githubUrl}
          />
        </div>
      </CardBody>
    </Card>
  );
};
