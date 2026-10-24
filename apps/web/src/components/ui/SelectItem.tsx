import { forwardRef } from 'react';

import type { SelectItemProps as BaseSelectItemProps } from '@ariakit/react';
import { SelectItem as BaseSelectItem, SelectItemCheck } from '@ariakit/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { cn } from '@/utils/cn';

export type SelectItemProps = BaseSelectItemProps;

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <BaseSelectItem
        ref={ref}
        {...props}
        className={cn(
          'relative flex cursor-pointer select-none items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium outline-none transition-colors text-text-2 ',
          'data-active-item:bg-accent-soft data-active-item:text-text aria-selected:text-accent-text ',
          className,
        )}
      >
        <span className="truncate">{children || props.value}</span>

        <SelectItemCheck>
          <HugeiconsIcon
            className="h-4 w-4 text-accent-text "
            icon={Tick02Icon}
          />
        </SelectItemCheck>
      </BaseSelectItem>
    );
  },
);

SelectItem.displayName = 'SelectItem';
