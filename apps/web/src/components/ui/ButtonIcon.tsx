'use client';

import { ComponentProps, FC, forwardRef } from 'react';

import { Button } from '@ariakit/react';
import clsx from 'clsx';
import { Loading03Icon } from 'hugeicons-react';

type ButtonIconSize = 'sm' | 'md' | 'lg';
type ButtonIconVariant = 'primary' | 'secondary' | 'ghost' | 'black';
type ButtonIconShape = 'circle' | 'rounded' | 'square';

export type ButtonIconProps = ComponentProps<'button'> & {
  size?: ButtonIconSize;
  variant?: ButtonIconVariant;
  shape?: ButtonIconShape;
  isLoading?: boolean;
  disableAnimation?: boolean;
  icon?: FC<{ size?: number; className?: string }>;
};

const baseStyles =
  'inline-flex items-center justify-center transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<ButtonIconVariant, string> = {
  primary:
    'bg-violet-600 text-white shadow-md shadow-violet-600/20 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-600/30 focus-visible:ring-violet-600',
  secondary:
    'bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 hover:shadow-md focus-visible:ring-slate-400 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:hover:border-slate-700',
  ghost:
    'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100',
  black:
    'bg-slate-900 text-white shadow-md shadow-slate-900/10 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 focus-visible:ring-slate-900 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200',
};

const sizes: Record<ButtonIconSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const shapes: Record<ButtonIconShape, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-lg',
  square: 'rounded-md',
};

const iconSizes: Record<ButtonIconSize, number> = {
  sm: 14,
  md: 18,
  lg: 20,
};

export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(
  (
    {
      className,
      size = 'md',
      variant = 'primary',
      shape = 'circle',
      isLoading = false,
      disableAnimation = false,
      icon,
      children,
      ...props
    },
    ref,
  ) => {
    const shouldAnimate = !disableAnimation && variant !== 'ghost';

    const Icon = icon;

    return (
      <Button
        ref={ref}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          shapes[shape],
          {
            'hover:-translate-y-0.5 active:translate-y-0': shouldAnimate,
            'cursor-pointer': !isLoading,
            'cursor-wait opacity-80': isLoading,
          },
          className,
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <Loading03Icon size={iconSizes[size]} className="animate-spin" />
        ) : Icon ? (
          <Icon size={iconSizes[size]} />
        ) : (
          children
        )}
      </Button>
    );
  },
);

ButtonIcon.displayName = 'ButtonIcon';
