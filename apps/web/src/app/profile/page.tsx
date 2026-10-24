import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';

import { GithubIcon, Link01Icon } from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';
import { HugeiconsIcon } from '@hugeicons/react';

import { getUserProfileAction } from '@/actions/getUserProfileAction';
import { AuthGate } from '@/components/AuthGate';
import { ContactDetailsCard } from '@/components/profile/ContactDetailsCard';
import { Chip } from '@/components/ui/Chip';
import { Heading } from '@/components/ui/Heading';
import { Shell } from '@/components/ui/Shell';
import { authOptions } from '@/lib/auth';
import { githubAppUrl } from '@/utils/githubAppUrl';

export const metadata: Metadata = {
  description:
    'View your adventurer identity, manage account details, and check your Habitica connection status.',
  robots: {
    follow: false,
    index: false,
  },
  title: 'Profile',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <AuthGate />;
  }

  const { data: profile } = await getUserProfileAction();

  if (!profile) {
    return null;
  }

  const joined = new Date(profile.joinedAt).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Shell className="flex flex-col gap-8 pt-14 pb-24">
      <div className="flex flex-col gap-1.5">
        <Heading level={1}>Profile</Heading>
        <p className="text-text-2">
          Your GitHub details and how Octogriffin is connected.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-4">
          <section className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface px-6 py-8 text-center shadow-e1">
            <Image
              alt=""
              className="h-24 w-24 rounded-full bg-fill object-cover ring-4 ring-accent-soft"
              height={96}
              priority
              src={profile.avatar || '/octogriffin_logo_square.png'}
              width={96}
            />
            <div className="flex flex-col gap-0.5">
              <Heading level={2} size="h3">
                {profile.name}
              </Heading>
              <span className="font-mono text-sm text-muted">
                @{profile.handle}
              </span>
            </div>
            <p className="text-[13px] text-muted">
              Octogriffin member since {joined}
            </p>
          </section>

          <section className="flex flex-col rounded-xl border border-border bg-surface shadow-e1">
            <h2 className="border-b border-border px-5 py-4 text-[15px] font-semibold text-text">
              Connections
            </h2>
            <ConnectionRow
              action={
                profile.hasInstallation
                  ? { external: true, href: githubAppUrl(), label: 'Manage' }
                  : { href: '/installation', label: 'Install' }
              }
              connected={profile.hasInstallation}
              icon={GithubIcon}
              label="GitHub App"
              status={profile.hasInstallation ? 'Installed' : 'Not installed'}
            />
            <ConnectionRow
              action={{
                href: '/dashboard/settings',
                label: profile.isLinked ? 'Settings' : 'Link account',
              }}
              connected={profile.isLinked}
              icon={Link01Icon}
              label="Habitica"
              status={profile.isLinked ? 'Linked' : 'Not linked'}
            />
          </section>
        </div>

        <div className="lg:col-span-8">
          <ContactDetailsCard profile={profile} />
        </div>
      </div>
    </Shell>
  );
}

const ConnectionRow = ({
  action,
  connected,
  icon,
  label,
  status,
}: {
  action: { external?: boolean; href: string; label: string };
  connected: boolean;
  icon: IconSvgElement;
  label: string;
  status: string;
}) => (
  <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5 last:border-b-0">
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-fill text-text-2">
        <HugeiconsIcon icon={icon} size={18} />
      </span>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-text">{label}</span>
        <Chip
          className="w-fit px-0 bg-transparent"
          dot
          tone={connected ? 'ok' : 'neutral'}
        >
          {status}
        </Chip>
      </div>
    </div>
    <Link
      className="text-[13px] font-semibold text-accent-text hover:underline"
      href={action.href}
      rel={action.external ? 'noreferrer' : undefined}
      target={action.external ? '_blank' : undefined}
    >
      {action.label}
    </Link>
  </div>
);
