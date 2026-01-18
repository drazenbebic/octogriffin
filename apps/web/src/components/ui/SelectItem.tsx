import { forwardRef } from 'react';

import {
  SelectItem as BaseSelectItem,
  SelectItemCheck,
  SelectItemProps as BaseSelectItemProps,
} from '@ariakit/react';
import clsx from 'clsx';
import { Tick02Icon } from 'hugeicons-react';

export type SelectItemProps = BaseSelectItemProps;

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <BaseSelectItem
        ref={ref}
        {...props}
        className={clsx(
          'relative flex cursor-pointer select-none items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium outline-none transition-colors text-slate-700',
          'data-active-item:bg-violet-50 data-active-item:text-violet-900 aria-selected:text-violet-700',
          className,
        )}
      >
        <span className="truncate">{children || props.value}</span>

        <SelectItemCheck>
          <Tick02Icon className="h-4 w-4 text-violet-600" />
        </SelectItemCheck>
      </BaseSelectItem>
    );
  },
);

SelectItem.displayName = 'SelectItem';
