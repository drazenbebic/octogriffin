'use client';

import type { FC, ReactNode } from 'react';

import type { ButtonProps as BaseButtonProps } from '@ariakit/react';
import { Button as BaseButton } from '@ariakit/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { cn } from '@/utils/cn';

type ButtonVariant = 'danger' | 'ghost' | 'onGrain' | 'primary' | 'secondary';
type ButtonSize = 'lg' | 'md' | 'sm';

export type ButtonProps = {
  children?: ReactNode;
  className?: string;
  isLoading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
} & BaseButtonProps;

const baseStyles =
  'relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:translate-y-px disabled:pointer-events-none disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  danger: 'bg-hp text-white hover:brightness-110',
  ghost: 'bg-transparent font-medium text-text-2 hover:bg-fill hover:text-text',
  onGrain:
    'bg-white text-griffin-800 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] hover:bg-griffin-50',
  primary: 'bg-accent text-white shadow-lift hover:bg-accent-hover',
  secondary:
    'border border-border-strong bg-surface text-text shadow-e1 hover:bg-sunken',
};

const sizes: Record<ButtonSize, string> = {
  lg: 'h-12 rounded-[12px] px-5 text-[15px]',
  md: 'h-10 px-4 text-sm',
  sm: 'h-8 rounded-[8px] px-3 text-[13px]',
};

const iconSizes: Record<ButtonSize, number> = {
  lg: 20,
  md: 18,
  sm: 14,
};

export const Button: FC<ButtonProps> = ({
  children,
  className,
  isLoading = false,
  size = 'md',
  variant = 'primary',
  ...props
}) => {
  return (
    <BaseButton
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        isLoading && 'cursor-wait opacity-80',
        className,
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <HugeiconsIcon
          className="animate-spin"
          icon={Loading03Icon}
          size={iconSizes[size]}
        />
      )}
      {children}
    </BaseButton>
  );
};
