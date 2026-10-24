import { forwardRef } from 'react';

import type { SelectLabelProps as BaseSelectLabelProps } from '@ariakit/react';
import { SelectLabel as BaseSelectLabel } from '@ariakit/react';

import { cn } from '@/utils/cn';

export type SelectLabelProps = BaseSelectLabelProps;

export const SelectLabel = forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseSelectLabel
        className={cn(
          'mb-1.5 block text-sm font-medium text-text-2',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

SelectLabel.displayName = 'SelectLabel';
