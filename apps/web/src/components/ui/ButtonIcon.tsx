'use client';

import type { ComponentProps } from 'react';
import { forwardRef } from 'react';

import { Button } from '@ariakit/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';
import { HugeiconsIcon } from '@hugeicons/react';

import { cn } from '@/utils/cn';

type ButtonIconSize = 'lg' | 'md' | 'sm';
type ButtonIconVariant = 'black' | 'ghost' | 'primary' | 'secondary';
type ButtonIconShape = 'circle' | 'rounded' | 'square';

export type ButtonIconProps = {
  disableAnimation?: boolean;
  icon?: IconSvgElement;
  isLoading?: boolean;
  shape?: ButtonIconShape;
  size?: ButtonIconSize;
  variant?: ButtonIconVariant;
} & ComponentProps<'button'>;

const baseStyles =
  'inline-flex items-center justify-center transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<ButtonIconVariant, string> = {
  black:
    'bg-slate-900 text-white shadow-md shadow-slate-900/10 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 focus-visible:ring-slate-900 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200',
  ghost:
    'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100',
  primary:
    'bg-violet-600 text-white shadow-md shadow-violet-600/20 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-600/30 focus-visible:ring-violet-600',
  secondary:
    'bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 hover:shadow-md focus-visible:ring-slate-400 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:hover:border-slate-700',
};

const sizes: Record<ButtonIconSize, string> = {
  lg: 'h-12 w-12',
  md: 'h-10 w-10',
  sm: 'h-8 w-8',
};

const shapes: Record<ButtonIconShape, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-lg',
  square: 'rounded-md',
};

const iconSizes: Record<ButtonIconSize, number> = {
  lg: 20,
  md: 18,
  sm: 14,
};

export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(
  (
    {
      children,
      className,
      disableAnimation = false,
      icon,
      isLoading = false,
      shape = 'circle',
      size = 'md',
      variant = 'primary',
      ...props
    },
    ref,
  ) => {
    const shouldAnimate = !disableAnimation && variant !== 'ghost';

    return (
      <Button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          shapes[shape],
          {
            'cursor-pointer': !isLoading,
            'cursor-wait opacity-80': isLoading,
            'hover:-translate-y-0.5 active:translate-y-0': shouldAnimate,
          },
          className,
        )}
        disabled={isLoading || props.disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <HugeiconsIcon
            className="animate-spin"
            icon={Loading03Icon}
            size={iconSizes[size]}
          />
        ) : icon ? (
          <HugeiconsIcon icon={icon} size={iconSizes[size]} />
        ) : (
          children
        )}
      </Button>
    );
  },
);

ButtonIcon.displayName = 'ButtonIcon';
