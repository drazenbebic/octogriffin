import type { ElementType, FC, ReactNode } from 'react';
import { createElement } from 'react';

import { cn } from '@/utils/cn';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingSize = 'display-xl' | 'display' | 'h1' | 'h2' | 'h3' | 'h4';
/** @deprecated Old size names, kept until every page is migrated. */
type LegacyHeadingSize = '2xl' | '3xl' | '4xl' | 'base' | 'lg' | 'sm' | 'xl';
type HeadingColor = 'accent' | 'inherit' | 'text';
/** @deprecated Old colour names, kept until every page is migrated. */
type LegacyHeadingColor = 'slate' | 'violet';

export type HeadingProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  color?: HeadingColor | LegacyHeadingColor;
  id?: string;
  level?: HeadingLevel;
  size?: HeadingSize | LegacyHeadingSize;
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

const legacySizes: Record<LegacyHeadingSize, HeadingSize> = {
  '2xl': 'h2',
  '3xl': 'h1',
  '4xl': 'display',
  base: 'h4',
  lg: 'h3',
  sm: 'h4',
  xl: 'h3',
};

const colors: Record<HeadingColor, string> = {
  accent: 'text-accent-text',
  inherit: 'text-inherit',
  text: 'text-text',
};

const legacyColors: Record<LegacyHeadingColor, HeadingColor> = {
  slate: 'text',
  violet: 'accent',
};

const defaultSizeMap: Record<HeadingLevel, HeadingSize> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h4',
  6: 'h4',
};

const resolveSize = (size: HeadingProps['size']): HeadingSize | undefined =>
  size && size in legacySizes
    ? legacySizes[size as LegacyHeadingSize]
    : (size as HeadingSize | undefined);

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
  const resolvedSize = resolveSize(size) || defaultSizeMap[level];
  const resolvedColor =
    color in legacyColors
      ? legacyColors[color as LegacyHeadingColor]
      : (color as HeadingColor);

  return createElement(
    Tag,
    {
      className: cn(sizes[resolvedSize], colors[resolvedColor], className),
      ...props,
    },
    children,
  );
};
