import type { ElementType, FC, ReactNode } from 'react';

import { cn } from '@/utils/cn';

export type SkeletonProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  variant?: 'circular' | 'rectangular' | 'rounded' | 'text';
};

export const Skeleton: FC<SkeletonProps> = ({
  as: Tag = 'div',
  children,
  className,
  variant = 'text',
  ...props
}) => {
  const variants = {
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
    text: 'rounded-md',
  };

  return (
    <Tag
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-slate-800',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};
