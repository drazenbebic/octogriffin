import { ElementType, FC, ReactNode } from 'react';

import clsx from 'clsx';

export type SkeletonProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
};

export const Skeleton: FC<SkeletonProps> = ({
  as: Tag = 'div',
  className,
  children,
  variant = 'text',
  ...props
}) => {
  const variants = {
    text: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  return (
    <Tag
      className={clsx(
        'animate-pulse bg-slate-200',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};
