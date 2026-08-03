import { forwardRef } from 'react';

import {
  SelectGroupLabel as BaseSelectGroupLabel,
  SelectGroupLabelProps as BaseSelectGroupLabelProps,
} from '@ariakit/react';

import { cn } from '@/utils/cn';

export type SelectGroupLabelProps = BaseSelectGroupLabelProps;

export const SelectGroupLabel = forwardRef<
  HTMLDivElement,
  SelectGroupLabelProps
>(({ className, ...props }, ref) => {
  return (
    <BaseSelectGroupLabel
      className={cn(
        'px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 select-none dark:text-slate-500',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

SelectGroupLabel.displayName = 'SelectGroupLabel';
