import { ElementType, FC, ReactNode } from 'react';
import Link from 'next/link';

import clsx from 'clsx';

interface PillProps {
  children: ReactNode;
  href?: string;
  target?: string;
  className?: string;
  variant?: 'shiny' | 'accent' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  as?: ElementType;
}

export const Pill: FC<PillProps> = ({
  children,
  href,
  target,
  className = '',
  variant = 'neutral',
  size = 'md',
  as,
}) => {
  const Tag = as || (href ? Link : 'div');
  const isLink = !!href;

  const baseStyles =
    'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full transition-all duration-300';

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const variants = {
    shiny: 'group bg-slate-50 p-[1px] dark:bg-slate-800',
    accent:
      'bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 hover:border-violet-300 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800 dark:hover:bg-violet-900/50',
    neutral:
      'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
    outline:
      'border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800/50',
  };

  const content = (
    <>
      {variant === 'shiny' && (
        <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#F1F5F9_0%,#F1F5F9_50%,#8B5CF6_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#1e293b_0%,#1e293b_50%,#8B5CF6_100%)] opacity-75 transition-opacity duration-500 group-hover:opacity-100" />
      )}

      <span
        className={clsx(
          'relative flex h-full w-full items-center justify-center gap-2 rounded-full',
          {
            'bg-white px-3 py-1 backdrop-blur-3xl transition-colors group-hover:bg-slate-50 dark:bg-slate-900 dark:group-hover:bg-slate-800':
              variant === 'shiny',
          },
        )}
      >
        {children}
      </span>
    </>
  );

  return (
    <Tag
      href={href}
      target={target}
      className={clsx(
        baseStyles,
        variant !== 'shiny' && sizeStyles[size],
        variants[variant],
        isLink && 'cursor-pointer',
        className,
      )}
    >
      {content}
    </Tag>
  );
};
