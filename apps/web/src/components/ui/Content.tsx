import { ElementType, FC, ReactNode } from 'react';

import { cn } from '@/utils/cn';

type ContentSize = 'base' | 'lg' | 'sm' | 'xs';
type ContentColor = 'note' | 'slate' | 'violet';

export type ContentProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  color?: ContentColor;
  size?: ContentSize;
};

const sizes: Record<ContentSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
};

const colors: Record<ContentColor, string> = {
  slate: 'text-slate-600 dark:text-slate-400',
  violet: 'text-violet-600 dark:text-violet-400',
  note: 'text-slate-500 dark:text-slate-400',
};

export const Content: FC<ContentProps> = ({
  as: Tag = 'p',
  children,
  className,
  color = 'slate',
  size = 'base',
  ...props
}) => {
  return (
    <Tag
      className={cn('leading-relaxed', sizes[size], colors[color], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
