import { ElementType, FC, ReactNode } from 'react';

import clsx from 'clsx';

type ContentSize = 'xs' | 'sm' | 'base' | 'lg';
type ContentColor = 'slate' | 'violet' | 'note';

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
  slate: 'text-slate-600',
  violet: 'text-violet-600',
  note: 'text-slate-400',
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
      className={clsx('leading-relaxed', sizes[size], colors[color], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
