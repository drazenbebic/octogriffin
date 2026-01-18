import { FC, ReactNode } from 'react';

import { Activity01Icon, FlashIcon, Settings01Icon } from 'hugeicons-react';

import { TabItem } from '@/app/dashboard/components/TabItem';
import { TabList } from '@/app/dashboard/components/TabList';
import { TabPanel } from '@/app/dashboard/components/TabPanel';
import { TabProvider } from '@/app/dashboard/components/TabProvider';
import { Card } from '@/components/ui/Card';
import { CardBody } from '@/components/ui/CardBody';

export type MainPanelProps = {
  children?: ReactNode;
};

export const MainPanel: FC<MainPanelProps> = ({ children }) => {
  return (
    <Card variant="elevated" className="h-full">
      <TabProvider>
        <div className="border-b border-slate-100 px-6 pt-6">
          <TabList
            className="-mb-px flex space-x-6"
            aria-label="Dashboard Views"
          >
            <TabItem href="/dashboard" icon={FlashIcon}>
              Triggers
            </TabItem>
            <TabItem href="/dashboard/history" icon={Activity01Icon}>
              History
            </TabItem>
            <TabItem href="/dashboard/settings" icon={Settings01Icon}>
              Settings
            </TabItem>
          </TabList>
        </div>

        <CardBody className="h-full">
          <TabPanel className="outline-none h-full">{children}</TabPanel>
        </CardBody>
      </TabProvider>
    </Card>
  );
};
