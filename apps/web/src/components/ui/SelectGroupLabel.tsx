import { forwardRef } from 'react';

import type { SelectGroupLabelProps as BaseSelectGroupLabelProps } from '@ariakit/react';
import { SelectGroupLabel as BaseSelectGroupLabel } from '@ariakit/react';

import { cn } from '@/utils/cn';

export type SelectGroupLabelProps = BaseSelectGroupLabelProps;

export const SelectGroupLabel = forwardRef<
  HTMLDivElement,
  SelectGroupLabelProps
>(({ className, ...props }, ref) => {
  return (
    <BaseSelectGroupLabel
      className={cn(
        'px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted select-none ',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

SelectGroupLabel.displayName = 'SelectGroupLabel';
