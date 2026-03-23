'use client';

import { FC, ReactNode } from 'react';

import {
  Button as BaseButton,
  ButtonProps as BaseButtonProps,
} from '@ariakit/react';
import clsx from 'clsx';
import { Loading03Icon } from 'hugeicons-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'black';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = BaseButtonProps & {
  children?: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

const baseStyles =
  'relative inline-flex gap-2 items-center justify-center rounded-lg font-semibold transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-violet-600 text-white shadow-md shadow-violet-600/20 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-600/30 focus-visible:ring-violet-600',
  secondary:
    'bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 hover:shadow-md focus-visible:ring-slate-400 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:hover:border-slate-700',
  ghost:
    'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400 hover:-translate-y-0 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-50',
  black:
    'bg-slate-900 text-white shadow-md shadow-slate-900/10 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 focus-visible:ring-slate-900 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
};

const iconSizes: Record<ButtonSize, number> = {
  sm: 14,
  md: 18,
  lg: 20,
};

export const Button: FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  ...props
}) => {
  return (
    <BaseButton
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
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <Loading03Icon size={iconSizes[size]} className="animate-spin" />
      )}
      {children}
    </BaseButton>
  );
};
