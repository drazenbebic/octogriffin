import type { ElementType, FC, ReactNode } from 'react';
import { createElement } from 'react';

import { cn } from '@/utils/cn';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingSize = '2xl' | '3xl' | '4xl' | 'base' | 'lg' | 'sm' | 'xl';
type HeadingColor = 'inherit' | 'slate' | 'violet';

export type HeadingProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  color?: HeadingColor;
  level?: HeadingLevel;
  size?: HeadingSize;
};

const sizes: Record<HeadingSize, string> = {
  '2xl': 'text-2xl font-bold tracking-tight',
  '3xl': 'text-3xl sm:text-4xl font-bold tracking-tight',
  '4xl': 'text-4xl sm:text-5xl font-extrabold tracking-tight',
  base: 'text-base font-semibold tracking-tight',
  lg: 'text-lg font-semibold tracking-tight',
  sm: 'text-sm font-semibold tracking-tight',
  xl: 'text-xl font-bold tracking-tight',
};

const colors: Record<HeadingColor, string> = {
  inherit: 'text-inherit',
  slate: 'text-slate-900 dark:text-slate-50',
  violet: 'text-violet-900 dark:text-violet-100',
};

const defaultSizeMap: Record<HeadingLevel, HeadingSize> = {
  1: '4xl',
  2: '3xl',
  3: '2xl',
  4: 'xl',
  5: 'lg',
  6: 'base',
};

export const Heading: FC<HeadingProps> = ({
  as,
  children,
  className,
  color = 'slate',
  level = 2,
  size,
  ...props
}) => {
  const Tag = as || `h${level}`;
  const resolvedSize = size || defaultSizeMap[level];

  return createElement(
    Tag,
    {
      className: cn(sizes[resolvedSize], colors[color], className),
      ...props,
    },
    children,
  );
};
