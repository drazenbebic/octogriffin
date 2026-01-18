import { ReactNode } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

import clsx from 'clsx';
import {
  Building03Icon,
  GithubIcon,
  Globe02Icon,
  Location01Icon,
  Mail01Icon,
} from 'hugeicons-react';

import { getUserProfileAction } from '@/actions/getUserProfileAction';
import { AuthGate } from '@/components/AuthGate';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CardBody } from '@/components/ui/CardBody';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Profile',
  description:
    'View your adventurer identity, manage account details, and check your Habitica connection status.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <AuthGate />;
  }

  const profile = await getUserProfileAction();

  if (!profile) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10">
        <Heading
          level={1}
          size="3xl"
          className="mb-2 bg-linear-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent"
        >
          Adventurer Profile
        </Heading>
        <Content size="lg">
          Your personal identity card and connection status.
        </Content>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Card
            variant="elevated"
            className="overflow-hidden border-0 shadow-xl shadow-violet-900/5 ring-1 ring-slate-900/5"
          >
            <div className="h-32 w-full bg-linear-to-br from-violet-600 via-indigo-600 to-blue-600 relative" />

            <div className="relative -mt-16 px-6 pb-8 text-center">
              <div className="mx-auto inline-flex rounded-full bg-white p-2 shadow-lg">
                <Image
                  src={profile.avatar || '/placeholder-avatar.png'}
                  alt={profile.handle}
                  width={112}
                  height={112}
                  className="rounded-full bg-slate-100 object-cover"
                  priority
                />
              </div>

              <div className="mt-4">
                <Heading level={2} size="xl" className="tracking-tight">
                  {profile.name}
                </Heading>
                <Content color="violet" className="font-medium">
                  @{profile.handle}
                </Content>
              </div>

              <div className="mt-6 flex justify-center">
                <Badge
                  variant={profile.isLinked ? 'success' : 'warning'}
                  size="md"
                  hasDot
                  className="shadow-sm"
                >
                  {profile.isLinked ? 'Sync Active' : 'No Sync Configured'}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-8">
          <Card variant="flat" className="h-full bg-white/50 backdrop-blur-sm">
            <CardBody>
              <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-2">
                <div>
                  <Heading level={3} size="lg">
                    Contact & Details
                  </Heading>
                  <Content size="sm" className="mt-1">
                    Public information from your GitHub profile.
                  </Content>
                </div>
              </div>

              <div className="flex flex-col divide-y divide-slate-100">
                <DetailRow
                  icon={<Mail01Icon size={18} />}
                  label="Email Address"
                  value={profile.email}
                  fallback="Not public"
                />
                <DetailRow
                  icon={<Building03Icon size={18} />}
                  label="Company"
                  value={profile.company}
                  fallback="Freelance"
                />
                <DetailRow
                  icon={<Location01Icon size={18} />}
                  label="Location"
                  value={profile.location}
                  fallback="Unknown Realm"
                />
                <DetailRow
                  icon={<Globe02Icon size={18} />}
                  label="Website"
                  value={profile.website}
                  isLink
                />
                <DetailRow
                  icon={<GithubIcon size={18} />}
                  label="GitHub Profile"
                  value={profile.githubUrl}
                  isLink
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

const DetailRow = ({
  icon,
  label,
  value,
  fallback,
  isLink,
}: {
  icon: ReactNode;
  label: string;
  value: string | null | undefined;
  fallback?: string;
  isLink?: boolean;
}) => {
  const displayValue = value || fallback;

  if (!displayValue) {
    return null;
  }

  return (
    <div className="group flex items-center justify-between py-4 transition-colors hover:bg-slate-50/50 sm:px-4 sm:-mx-4 sm:rounded-xl">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-colors group-hover:bg-white group-hover:text-violet-600 group-hover:shadow-sm ring-1 ring-slate-900/5">
          {icon}
        </div>
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>

      <div className="text-right">
        {isLink && value ? (
          <Link
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-violet-600 hover:text-violet-700 hover:underline decoration-violet-300 underline-offset-4"
          >
            {value.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </Link>
        ) : (
          <span
            className={clsx('text-sm font-medium', {
              'text-slate-900': value,
              'text-slate-400 italic': !value,
            })}
          >
            {displayValue}
          </span>
        )}
      </div>
    </div>
  );
};
