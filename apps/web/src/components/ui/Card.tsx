import type { FC, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

type CardVariant = 'outlined' | 'sunken' | 'surface';

export type CardProps = {
  children?: ReactNode;
  variant?: CardVariant;
} & HTMLAttributes<HTMLDivElement>;

const variants: Record<CardVariant, string> = {
  outlined: 'border-[1.5px] border-dashed border-border-strong',
  sunken: 'bg-sunken border border-border',
  surface: 'bg-surface border border-border shadow-e1',
};

export const Card: FC<CardProps> = ({
  children,
  className,
  variant = 'surface',
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-lg',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
