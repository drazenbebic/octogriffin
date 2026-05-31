import { ElementType, FC, ReactNode } from 'react';

import { cn } from '@/utils/cn';

export type TextAccentProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  variant?: 'brand' | 'gold' | 'mana';
  glowing?: boolean;
  breathing?: boolean;
};

export const TextAccent: FC<TextAccentProps> = ({
  as: Tag = 'span',
  children,
  className,
  variant = 'brand',
  glowing = false,
  breathing = false,
  ...props
}) => {
  const variants = {
    brand: 'from-violet-600 to-rose-500',
    gold: 'from-amber-400 to-orange-500',
    mana: 'from-cyan-500 to-blue-600',
  };

  const glows = {
    brand: 'drop-shadow-[0_0_20px_rgba(124,58,237,0.5)]',
    gold: 'drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]',
    mana: 'drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]',
  };

  return (
    <Tag
      className={cn(
        'bg-linear-to-r bg-clip-text text-transparent',
        variants[variant],
        glowing && glows[variant],
        breathing && 'animate-breathe',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};
