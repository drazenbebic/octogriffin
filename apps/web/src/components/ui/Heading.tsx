import type { ElementType, FC, ReactNode } from 'react';
import { createElement } from 'react';

import { cn } from '@/utils/cn';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingSize = 'display-xl' | 'display' | 'h1' | 'h2' | 'h3' | 'h4';
type HeadingColor = 'accent' | 'inherit' | 'text';

export type HeadingProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  color?: HeadingColor;
  id?: string;
  level?: HeadingLevel;
  size?: HeadingSize;
};

const display = 'font-display font-bold tracking-[-0.02em] text-balance';

const sizes: Record<HeadingSize, string> = {
  display: cn(display, 'text-[48px] leading-[1.05] font-extrabold'),
  'display-xl': cn(
    display,
    'text-[clamp(40px,5.4vw,64px)] leading-none font-extrabold',
  ),
  h1: cn(display, 'text-[36px] leading-[1.1]'),
  h2: cn(display, 'text-[28px] leading-[1.15]'),
  h3: cn(display, 'text-[20px] leading-[1.3]'),
  h4: 'font-sans font-semibold text-base leading-[1.4]',
};

const colors: Record<HeadingColor, string> = {
  accent: 'text-accent-text',
  inherit: 'text-inherit',
  text: 'text-text',
};

const defaultSizeMap: Record<HeadingLevel, HeadingSize> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h4',
  6: 'h4',
};

export const Heading: FC<HeadingProps> = ({
  as,
  children,
  className,
  color = 'text',
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
