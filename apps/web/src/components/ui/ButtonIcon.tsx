'use client';

import type { ComponentProps, ReactNode } from 'react';
import { forwardRef } from 'react';

import { Button } from '@ariakit/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';
import { HugeiconsIcon } from '@hugeicons/react';

import type { TooltipProps } from '@/components/ui/Tooltip';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/utils/cn';

type ButtonIconSize = 'lg' | 'md' | 'sm';
type ButtonIconVariant = 'danger' | 'ghost' | 'primary' | 'secondary';
type ButtonIconShape = 'circle' | 'rounded';

export type ButtonIconProps = {
  children?: ReactNode;
  icon?: IconSvgElement;
  isLoading?: boolean;
  /** The accessible name, also shown as the tooltip. */
  label: string;
  shape?: ButtonIconShape;
  size?: ButtonIconSize;
  tooltip?: Omit<TooltipProps, 'children' | 'content'>;
  variant?: ButtonIconVariant;
} & Omit<ComponentProps<'button'>, 'aria-label' | 'children' | 'title'>;

const variants: Record<ButtonIconVariant, string> = {
  danger: 'bg-transparent text-muted hover:bg-hp-soft hover:text-hp',
  ghost: 'bg-transparent text-text-2 hover:bg-fill hover:text-text',
  primary: 'bg-accent text-white shadow-lift hover:bg-accent-hover',
  secondary:
    'border border-border-strong bg-surface text-text-2 shadow-e1 hover:bg-sunken hover:text-text',
};

const sizes: Record<ButtonIconSize, string> = {
  lg: 'h-12 w-12',
  md: 'h-10 w-10',
  sm: 'h-9 w-9',
};

const shapes: Record<ButtonIconShape, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-md',
};

const iconSizes: Record<ButtonIconSize, number> = {
  lg: 20,
  md: 18,
  sm: 16,
};

export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(
  (
    {
      children,
      className,
      icon,
      isLoading = false,
      label,
      shape = 'rounded',
      size = 'md',
      tooltip,
      variant = 'ghost',
      ...props
    },
    ref,
  ) => (
    <Tooltip content={label} type="label" {...tooltip}>
      <Button
        aria-label={label}
        className={cn(
          'inline-flex shrink-0 cursor-pointer items-center justify-center transition-colors duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          shapes[shape],
          isLoading && 'cursor-wait opacity-80',
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
    </Tooltip>
  ),
);

ButtonIcon.displayName = 'ButtonIcon';
