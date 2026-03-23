import { createElement, ElementType, FC, ReactNode } from 'react';

import clsx from 'clsx';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingSize = '4xl' | '3xl' | '2xl' | 'xl' | 'lg' | 'base';
type HeadingColor = 'slate' | 'violet';

export type HeadingProps = {
  as?: ElementType;
  level?: HeadingLevel;
  size?: HeadingSize;
  children?: ReactNode;
  className?: string;
  color?: HeadingColor;
};

const sizes: Record<HeadingSize, string> = {
  '4xl': 'text-4xl sm:text-5xl font-extrabold tracking-tight',
  '3xl': 'text-3xl sm:text-4xl font-bold tracking-tight',
  '2xl': 'text-2xl font-bold tracking-tight',
  xl: 'text-xl font-bold tracking-tight',
  lg: 'text-lg font-semibold tracking-tight',
  base: 'text-base font-semibold tracking-tight',
};

const colors: Record<HeadingColor, string> = {
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
  level = 2,
  size,
  children,
  className,
  color = 'slate',
  ...props
}) => {
  const Tag = as || `h${level}`;
  const resolvedSize = size || defaultSizeMap[level];

  return createElement(
    Tag,
    {
      className: clsx(sizes[resolvedSize], colors[color], className),
      ...props,
    },
    children,
  );
};
