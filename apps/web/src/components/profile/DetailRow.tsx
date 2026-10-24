import Link from 'next/link';
import type { FC, ReactNode } from 'react';
import { useMemo } from 'react';

import { cn } from '@/utils/cn';

export type DetailRowProps = {
  fallback?: string;
  icon: ReactNode;
  isLink?: boolean;
  label: string;
  value: null | string | undefined;
};

export const DetailRow: FC<DetailRowProps> = ({
  fallback,
  icon,
  isLink,
  label,
  value,
}) => {
  const displayValue = value || fallback;

  const linkText = useMemo(
    () => (value ? value.replace(/^https?:\/\//, '').replace(/\/$/, '') : ''),
    [value],
  );

  if (!displayValue) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-3.5 last:border-b-0">
      <dt className="flex items-center gap-3 text-sm text-text-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-fill text-muted">
          {icon}
        </span>
        {label}
      </dt>
      <dd className="min-w-0 truncate text-right text-sm">
        {isLink && value ? (
          <Link
            className="font-semibold text-accent-text underline-offset-4 hover:underline"
            href={value}
            rel="noopener noreferrer"
            target="_blank"
          >
            {linkText}
          </Link>
        ) : (
          <span
            className={cn(
              value ? 'font-medium text-text' : 'text-muted italic',
            )}
          >
            {displayValue}
          </span>
        )}
      </dd>
    </div>
  );
};
