import type { ElementType, FC, ReactNode } from 'react';

import { cn } from '@/utils/cn';

type ContentSize = 'base' | 'lg' | 'sm' | 'xs';
type ContentColor = 'accent' | 'muted' | 'text-2' | 'text';
/** @deprecated Old colour names, kept until every page is migrated. */
type LegacyContentColor = 'note' | 'slate' | 'violet';

export type ContentProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  color?: ContentColor | LegacyContentColor;
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

const legacyColors: Record<LegacyContentColor, ContentColor> = {
  note: 'muted',
  slate: 'text-2',
  violet: 'accent',
};

export const Content: FC<ContentProps> = ({
  as: Tag = 'p',
  children,
  className,
  color = 'text-2',
  size = 'base',
  ...props
}) => {
  const resolvedColor =
    color in legacyColors
      ? legacyColors[color as LegacyContentColor]
      : (color as ContentColor);

  return (
    <Tag
      className={cn(sizes[size], colors[resolvedColor], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
