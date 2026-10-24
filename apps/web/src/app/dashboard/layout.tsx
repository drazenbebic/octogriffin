import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import type { FC, ReactNode } from 'react';
import React from 'react';

import { AuthGate } from '@/components/AuthGate';
import { DashboardSummary } from '@/components/dashboard/DashboardSummary';
import { HabiticaStatsCard } from '@/components/dashboard/HabiticaStatsCard';
import { MainPanel } from '@/components/dashboard/MainPanel';
import { RepositoryListCard } from '@/components/dashboard/RepositoryListCard';
import { Heading } from '@/components/ui/Heading';
import { Shell } from '@/components/ui/Shell';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  description:
    'Manage your Habitica API connections, configure repository webhooks, and track your gamification progress.',
  robots: {
    follow: false,
    index: false,
  },
  title: {
    default: 'Octogriffin Dashboard',
    template: '%s | Octogriffin Dashboard',
  },
};

export type DashboardLayoutProps = {
  tabs: ReactNode;
};

const DashboardLayout: FC<DashboardLayoutProps> = async ({ tabs }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <AuthGate />;
  }

  return (
    <Shell className="flex flex-col gap-7 pt-10 pb-16">
      <div className="flex flex-col gap-1">
        <Heading level={1}>Dashboard</Heading>
        <DashboardSummary />
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <div className="min-w-0 flex-[999_1_640px]">
          <MainPanel>{tabs}</MainPanel>
        </div>

        <aside className="flex flex-[1_1_320px] flex-col gap-4">
          <HabiticaStatsCard />
          <RepositoryListCard />
        </aside>
      </div>
    </Shell>
  );
};

export default DashboardLayout;
