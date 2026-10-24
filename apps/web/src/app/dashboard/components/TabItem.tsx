import React, { forwardRef } from 'react';

import type { TabProps } from '@ariakit/react';
import { Tab as BaseTab } from '@ariakit/react';

import { cn } from '@/utils/cn';

type TabItemProps = {
  href: string;
} & TabProps;

export const TabItem = forwardRef<HTMLButtonElement, TabItemProps>(
  ({ children, href, ...props }, ref) => {
    const id = href.toString();

    return (
      <BaseTab
        className={cn(
          'inline-flex h-[34px] cursor-pointer items-center gap-2 rounded-[8px] border border-transparent px-3.5 text-[13px] font-medium text-text-2 outline-none transition-colors duration-[var(--dur-fast)]',
          'hover:text-text focus-visible:ring-2 focus-visible:ring-accent',
          'aria-selected:border-border-strong aria-selected:bg-raised aria-selected:font-semibold aria-selected:text-text aria-selected:shadow-lift',
        )}
        id={id}
        ref={ref}
        {...props}
      >
        {children}
      </BaseTab>
    );
  },
);

TabItem.displayName = 'TabItem';
