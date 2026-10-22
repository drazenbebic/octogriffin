'use client';

import { forwardRef } from 'react';

import type { TabPanelProps } from '@ariakit/react';
import {
  TabPanel as BaseTabPanel,
  useStoreState,
  useTabContext,
} from '@ariakit/react';

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ className, ...props }, ref) => {
    const tab = useTabContext();
    const tabId = useStoreState(tab, 'selectedId');

    return (
      <BaseTabPanel ref={ref} tabId={tabId} {...props} className={className} />
    );
  },
);

TabPanel.displayName = 'TabPanel';
