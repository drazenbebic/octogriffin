import Image from 'next/image';
import type { FC } from 'react';

import { cn } from '@/utils/cn';

export type AvatarProps = {
  alt?: string;
  className?: string;
  fallback?: string;
  shape?: 'circle' | 'rounded' | 'square';
  size?: 'lg' | 'md' | 'sm';
  src?: null | string;
  status?: 'error' | 'neutral' | 'success' | 'warning';
};

const sizeStyles: Record<string, string> = {
  lg: 'h-12 w-12 text-base',
  md: 'h-10 w-10 text-sm',
  sm: 'h-8 w-8 text-xs',
};

const shapeStyles: Record<string, string> = {
  circle: 'rounded-full',
  // Matches a 10px control's inner corner, e.g. the account menu button
  rounded: 'rounded-[8px]',
  square: 'rounded-none',
};

const statusColors: Record<string, string> = {
  error: 'bg-hp',
  neutral: 'bg-muted',
  success: 'bg-ok',
  warning: 'bg-xp',
};

export const Avatar: FC<AvatarProps> = ({
  alt = 'User avatar',
  className,
  fallback,
  shape = 'circle',
  size = 'md',
  src,
  status,
}) => {
  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'flex items-center justify-center overflow-hidden border border-border bg-sunken',
          sizeStyles[size],
          shapeStyles[shape],
        )}
      >
        {!!src ? (
          <Image
            alt={alt}
            className="h-full w-full object-cover"
            height={100}
            src={src}
            width={100}
          />
        ) : (
          <span className="font-medium text-muted uppercase ">
            {fallback?.substring(0, 2)}
          </span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 block rounded-full border-2 border-white ',
            statusColors[status],
            size === 'sm' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5',
          )}
        />
      )}
    </div>
  );
};
