import React, { FC, ReactNode } from 'react';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';

import { AuthGate } from '@/components/AuthGate';
import { HabiticaStatsCard } from '@/components/dashboard/HabiticaStatsCard';
import { IsConnected } from '@/components/dashboard/IsConnected';
import { MainPanel } from '@/components/dashboard/MainPanel';
import { RepositoryListCard } from '@/components/dashboard/RepositoryListCard';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Manage your Habitica API connections, configure repository webhooks, and track your gamification progress.',
  robots: {
    index: false,
    follow: false,
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
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Heading level={1} size="3xl" className="mb-2">
            Dashboard
          </Heading>
          <Content>Manage your Habitica connection and repositories.</Content>
        </div>

        <IsConnected />
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <MainPanel>{tabs}</MainPanel>
        </div>

        <div className="flex flex-col gap-6">
          <HabiticaStatsCard />
          <RepositoryListCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
