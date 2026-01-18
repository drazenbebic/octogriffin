import { FC, ReactNode } from 'react';

import {
  FormLabel as BaseFormLabel,
  FormLabelProps as BaseFormLabelProps,
} from '@ariakit/react';
import clsx from 'clsx';

export type FormLabelProps = BaseFormLabelProps & {
  children?: ReactNode;
  isRequired?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

export const FormLabel: FC<FormLabelProps> = ({
  className,
  children,
  isRequired,
  size = 'md',
  ...props
}) => {
  return (
    <BaseFormLabel
      className={clsx(
        'mb-1.5 block text-sm font-medium text-slate-700 select-none cursor-pointer',
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
      {isRequired && <span className="ml-1 text-red-500">*</span>}
    </BaseFormLabel>
  );
};
