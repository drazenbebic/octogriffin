import type { ElementType, FC, ReactNode } from 'react';

import { cn } from '@/utils/cn';

type ContentSize = 'base' | 'lg' | 'sm' | 'xs';
type ContentColor = 'accent' | 'muted' | 'text-2' | 'text';

export type ContentProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  color?: ContentColor;
  size?: ContentSize;
};

const sizes: Record<ContentSize, string> = {
  base: 'text-base leading-[1.6]',
  lg: 'text-lg leading-[1.6]',
  sm: 'text-sm leading-normal',
  xs: 'text-xs leading-normal',
};

const colors: Record<ContentColor, string> = {
  accent: 'text-accent-text',
  muted: 'text-muted',
  text: 'text-text',
  'text-2': 'text-text-2',
};

export const Content: FC<ContentProps> = ({
  as: Tag = 'p',
  children,
  className,
  color = 'text-2',
  size = 'base',
  ...props
}) => {
  return (
    <Tag className={cn(sizes[size], colors[color], className)} {...props}>
      {children}
    </Tag>
  );
};
