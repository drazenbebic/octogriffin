import { FC, HTMLAttributes, ReactNode } from 'react';

import clsx from 'clsx';

type BadgeVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral'
  | 'info';

type BadgeSize = 'sm' | 'md';

type BadgeShape = 'pill' | 'square';

const badgeBaseStyles =
  'inline-flex items-center justify-center font-medium transition-colors';

const variants: Record<BadgeVariant, string> = {
  primary:
    'bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800',
  success:
    'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  warning:
    'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  error:
    'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
  neutral:
    'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  info: 'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
};

const sizes: Record<BadgeSize, string> = {
  sm: 'text-xs px-2.5 py-0.5 gap-1.5',
  md: 'text-sm px-3 py-1 gap-2',
};

const dotColors: Record<BadgeVariant, string> = {
  primary: 'bg-violet-600',
  success: 'bg-emerald-600',
  warning: 'bg-amber-600',
  error: 'bg-red-600',
  neutral: 'bg-slate-500',
  info: 'bg-blue-500',
};

const shapes: Record<BadgeShape, string> = {
  pill: 'rounded-full',
  square: 'rounded-lg',
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  hasDot?: boolean;
  pulsing?: boolean;
  shape?: 'pill' | 'square';
};

export const Badge: FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  size = 'sm',
  hasDot = false,
  pulsing = false,
  shape = 'pill',
  ...props
}) => {
  return (
    <span
      className={clsx(
        badgeBaseStyles,
        variants[variant],
        sizes[size],
        shapes[shape],
        className,
      )}
      {...props}
    >
      {hasDot && (
        <span className="relative flex h-2 w-2">
          {pulsing && (
            <span
              className={clsx(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                dotColors[variant],
              )}
            />
          )}
          <span
            className={clsx(
              'relative inline-flex h-2 w-2 rounded-full',
              dotColors[variant],
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
};
