import { ComponentProps, forwardRef } from 'react';

import { Button } from '@ariakit/react';
import clsx from 'clsx';

export type ButtonIconProps = ComponentProps<'button'> & {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
};

const baseStyles =
  'inline-flex items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  primary: 'bg-violet-600 text-white hover:bg-violet-700',
  secondary:
    'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900',
  ghost:
    'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900',
};

const sizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(
  (
    {
      className,
      size = 'md',
      variant = 'primary',
      isLoading = false,
      ...props
    },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          {
            'cursor-pointer': !isLoading,
            'cursor-wait opacity-80': isLoading,
          },
          className,
        )}
        {...props}
      />
    );
  },
);

ButtonIcon.displayName = 'ButtonIcon';
