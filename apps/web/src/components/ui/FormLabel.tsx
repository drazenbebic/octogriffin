import { FC, ReactNode } from 'react';

import {
  FormLabel as BaseFormLabel,
  FormLabelProps as BaseFormLabelProps,
} from '@ariakit/react';

import { cn } from '@/utils/cn';

export type FormLabelProps = {
  children?: ReactNode;
  isRequired?: boolean;
  size?: 'lg' | 'md' | 'sm' | 'xl';
} & BaseFormLabelProps;

export const FormLabel: FC<FormLabelProps> = ({
  className,
  children,
  isRequired,
  size = 'md',
  ...props
}) => {
  return (
    <BaseFormLabel
      className={cn(
        'mb-1.5 block bg-transparent text-sm font-medium text-slate-700 select-none cursor-pointer dark:text-slate-200',
        {
          'text-sm': size === 'sm',
          'text-md': size === 'md',
          'text-lg': size === 'lg',
          'text-xl': size === 'xl',
        },
        className,
      )}
      {...props}
    >
      {children}
      {isRequired && (
        <span
          aria-hidden="true"
          className="ml-1 text-red-500 dark:text-red-400"
        >
          *
        </span>
      )}
    </BaseFormLabel>
  );
};
