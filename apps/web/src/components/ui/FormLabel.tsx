import type { FC, ReactNode } from 'react';

import type { FormLabelProps as BaseFormLabelProps } from '@ariakit/react';
import { FormLabel as BaseFormLabel } from '@ariakit/react';

import { cn } from '@/utils/cn';

export type FormLabelProps = {
  children?: ReactNode;
  isRequired?: boolean;
  size?: 'lg' | 'md' | 'sm' | 'xl';
} & BaseFormLabelProps;

export const FormLabel: FC<FormLabelProps> = ({
  children,
  className,
  isRequired,
  size = 'md',
  ...props
}) => {
  return (
    <BaseFormLabel
      className={cn(
        'mb-1.5 block bg-transparent text-sm font-medium text-text-2 select-none cursor-pointer ',
        {
          'text-lg': size === 'lg',
          'text-md': size === 'md',
          'text-sm': size === 'sm',
          'text-xl': size === 'xl',
        },
        className,
      )}
      {...props}
    >
      {children}
      {isRequired && (
        <span aria-hidden="true" className="ml-1 text-hp ">
          *
        </span>
      )}
    </BaseFormLabel>
  );
};
