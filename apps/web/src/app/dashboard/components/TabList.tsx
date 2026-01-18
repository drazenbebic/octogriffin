import { forwardRef } from 'react';

import { TabList as BaseTabList, TabListProps } from '@ariakit/react';

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ className, ...props }, ref) => {
    return <BaseTabList ref={ref} {...props} className={className} />;
  },
);

TabList.displayName = 'TabList';
