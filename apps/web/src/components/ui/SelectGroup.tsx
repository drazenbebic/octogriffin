import { forwardRef } from 'react';

import type { SelectGroupProps as BaseSelectGroupProps } from '@ariakit/react';
import { SelectGroup as BaseSelectGroup } from '@ariakit/react';

import { cn } from '@/utils/cn';

export type SelectGroupProps = BaseSelectGroupProps;

export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <BaseSelectGroup
        className={cn('group first:mt-0 mt-2', className)}
        ref={ref}
        {...props}
      >
        {children}
      </BaseSelectGroup>
    );
  },
);

SelectGroup.displayName = 'SelectGroup';
