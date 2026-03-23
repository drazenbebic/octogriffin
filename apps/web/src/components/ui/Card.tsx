import { FC, HTMLAttributes, ReactNode } from 'react';

import clsx from 'clsx';

type CardVariant = 'elevated' | 'outlined' | 'flat';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  variant?: CardVariant;
  isHoverable?: boolean;
};

const cardBaseStyles =
  'relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 ease-in-out';

const variants: Record<CardVariant, string> = {
  elevated:
    'bg-white border border-slate-100 shadow-xl shadow-violet-900/5 dark:bg-slate-900 dark:border-slate-800 dark:shadow-none',
  outlined: 'bg-transparent border-2 border-slate-200 dark:border-slate-800',
  flat: 'bg-slate-50 dark:bg-slate-900',
};

const hoverStyles: Record<string, string> = {
  elevated:
    'hover:shadow-2xl hover:shadow-violet-900/10 hover:-translate-y-1 cursor-pointer dark:hover:bg-slate-800/50',
  outlined:
    'hover:border-violet-200 hover:bg-slate-50 cursor-pointer dark:hover:border-violet-800 dark:hover:bg-slate-800/50',
  flat: 'hover:bg-slate-100 cursor-pointer dark:hover:bg-slate-800/50',
};

export const Card: FC<CardProps> = ({
  children,
  className,
  variant = 'elevated',
  isHoverable = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        cardBaseStyles,
        variants[variant],
        isHoverable && hoverStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
