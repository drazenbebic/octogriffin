import { forwardRef } from 'react';

import type { TabListProps } from '@ariakit/react';
import { TabList as BaseTabList } from '@ariakit/react';

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ className, ...props }, ref) => {
    return <BaseTabList ref={ref} {...props} className={className} />;
  },
);

TabList.displayName = 'TabList';
