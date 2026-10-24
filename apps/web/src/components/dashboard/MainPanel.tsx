import type { FC, ReactNode } from 'react';

import { TabItem } from '@/app/dashboard/components/TabItem';
import { TabList } from '@/app/dashboard/components/TabList';
import { TabPanel } from '@/app/dashboard/components/TabPanel';
import { TabProvider } from '@/app/dashboard/components/TabProvider';
import { TriggersCount } from '@/components/dashboard/TriggersCount';

export type MainPanelProps = {
  children?: ReactNode;
};

export const MainPanel: FC<MainPanelProps> = ({ children }) => {
  return (
    <TabProvider>
      <div className="flex flex-col gap-4">
        <TabList
          aria-label="Dashboard views"
          className="inline-flex w-fit gap-0.5 rounded-[12px] border border-border bg-sunken p-1"
        >
          <TabItem href="/dashboard">
            Triggers
            <TriggersCount />
          </TabItem>
          <TabItem href="/dashboard/history">History</TabItem>
          <TabItem href="/dashboard/settings">Settings</TabItem>
        </TabList>

        <TabPanel className="outline-none">{children}</TabPanel>
      </div>
    </TabProvider>
  );
};
