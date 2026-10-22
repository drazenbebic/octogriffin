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
  rounded: 'rounded-lg',
  square: 'rounded-none',
};

const statusColors: Record<string, string> = {
  error: 'bg-red-500',
  neutral: 'bg-slate-400',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
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
          'flex items-center justify-center overflow-hidden border border-slate-200 bg-slate-50 transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900',
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
          <span className="font-medium text-slate-500 uppercase dark:text-slate-400">
            {fallback?.substring(0, 2)}
          </span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 block rounded-full border-2 border-white dark:border-slate-950',
            statusColors[status],
            size === 'sm' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5',
          )}
        />
      )}
    </div>
  );
};
