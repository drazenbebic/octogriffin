import { forwardRef } from 'react';

import {
  SelectLabel as BaseSelectLabel,
  SelectLabelProps as BaseSelectLabelProps,
} from '@ariakit/react';
import clsx from 'clsx';

export type SelectLabelProps = BaseSelectLabelProps;

export const SelectLabel = forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseSelectLabel
        ref={ref}
        className={clsx(
          'mb-1.5 block text-sm font-medium text-slate-700',
          className,
        )}
        {...props}
      />
    );
  },
);

SelectLabel.displayName = 'SelectLabel';
