import type { FC, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

type CardVariant = 'outlined' | 'sunken' | 'surface';
/** @deprecated Old variant names, kept until every page is migrated. */
type LegacyCardVariant = 'elevated' | 'flat';

export type CardProps = {
  children?: ReactNode;
  variant?: CardVariant | LegacyCardVariant;
} & HTMLAttributes<HTMLDivElement>;

const variants: Record<CardVariant, string> = {
  outlined: 'border-[1.5px] border-dashed border-border-strong',
  sunken: 'bg-sunken border border-border',
  surface: 'bg-surface border border-border shadow-e1',
};

const legacyVariants: Record<LegacyCardVariant, CardVariant> = {
  elevated: 'surface',
  flat: 'sunken',
};

export const Card: FC<CardProps> = ({
  children,
  className,
  variant = 'surface',
  ...props
}) => {
  const resolvedVariant =
    variant in legacyVariants
      ? legacyVariants[variant as LegacyCardVariant]
      : (variant as CardVariant);

  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-lg',
        variants[resolvedVariant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
