import { FC, ReactNode } from 'react';

import {
  Button as BaseButton,
  ButtonProps as BaseButtonProps,
} from '@ariakit/react';
import clsx from 'clsx';
import { Loading03Icon } from 'hugeicons-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = BaseButtonProps & {
  children?: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

const baseStyles =
  'relative inline-flex gap-1 items-center justify-center rounded-full font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-violet-600 text-white shadow-md shadow-violet-600/20 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-600/30 focus-visible:ring-violet-600',
  secondary:
    'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 focus-visible:ring-slate-400',
  ghost:
    'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
};

const iconSizes: Record<ButtonSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
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
      {children}
      {isLoading && (
        <Loading03Icon size={iconSizes[size]} className="mr-2 animate-spin" />
      )}
    </BaseButton>
  );
};
