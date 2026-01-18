import { forwardRef } from 'react';

import {
  SelectGroupLabel as BaseSelectGroupLabel,
  SelectGroupLabelProps as BaseSelectGroupLabelProps,
} from '@ariakit/react';
import clsx from 'clsx';

export type SelectGroupLabelProps = BaseSelectGroupLabelProps;

export const SelectGroupLabel = forwardRef<
  HTMLDivElement,
  SelectGroupLabelProps
>(({ className, ...props }, ref) => {
  return (
    <BaseSelectGroupLabel
      ref={ref}
      className={clsx(
        'px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 select-none',
        className,
      )}
      {...props}
    />
  );
});

SelectGroupLabel.displayName = 'SelectGroupLabel';
