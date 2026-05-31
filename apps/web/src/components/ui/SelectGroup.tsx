import { forwardRef } from 'react';

import {
  SelectGroup as BaseSelectGroup,
  SelectGroupProps as BaseSelectGroupProps,
} from '@ariakit/react';

import { cn } from '@/utils/cn';

export type SelectGroupProps = BaseSelectGroupProps;

export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <BaseSelectGroup
        ref={ref}
        className={cn('group first:mt-0 mt-2', className)}
        {...props}
      >
        {children}
      </BaseSelectGroup>
    );
  },
);

SelectGroup.displayName = 'SelectGroup';
