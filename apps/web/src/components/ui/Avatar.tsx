import { FC } from 'react';
import Image from 'next/image';

import clsx from 'clsx';

export type AvatarProps = {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'rounded' | 'square';
  status?: 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
};

const sizeStyles: Record<string, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

const shapeStyles: Record<string, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-lg',
  square: 'rounded-none',
};

const statusColors: Record<string, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  neutral: 'bg-slate-400',
};

export const Avatar: FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  fallback,
  size = 'md',
  shape = 'circle',
  status,
  className,
}) => {
  return (
    <div className={clsx('relative inline-flex shrink-0', className)}>
      <div
        className={clsx(
          'flex items-center justify-center overflow-hidden border border-slate-200 bg-slate-50 transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900',
          sizeStyles[size],
          shapeStyles[shape],
        )}
      >
        {!!src ? (
          <Image
            src={src}
            alt={alt}
            width={100}
            height={100}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-medium text-slate-500 uppercase dark:text-slate-400">
            {fallback?.substring(0, 2)}
          </span>
        )}
      </div>

      {status && (
        <span
          className={clsx(
            'absolute -bottom-0.5 -right-0.5 block rounded-full border-2 border-white dark:border-slate-950',
            statusColors[status],
            size === 'sm' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5',
          )}
        />
      )}
    </div>
  );
};
