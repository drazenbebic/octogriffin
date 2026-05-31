import { FC, ReactNode, useMemo } from 'react';
import Link from 'next/link';

import { Content } from '@/components/ui/Content';
import { cn } from '@/utils/cn';

export type DetailRowProps = {
  icon: ReactNode;
  label: string;
  value: string | null | undefined;
  fallback?: string;
  isLink?: boolean;
};

export const DetailRow: FC<DetailRowProps> = ({
  icon,
  label,
  value,
  fallback,
  isLink,
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
    <div className="group flex items-center justify-between py-4 transition-colors hover:bg-slate-50/50 sm:px-4 sm:-mx-4 sm:rounded-xl dark:hover:bg-slate-800/50">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-colors group-hover:bg-white group-hover:text-violet-600 group-hover:shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-slate-700 dark:group-hover:text-violet-400 dark:ring-slate-800">
          {icon}
        </div>
        <Content as="span" size="sm" color="note" className="font-medium">
          {label}
        </Content>
      </div>

      <div className="text-right">
        {isLink && value ? (
          <Link
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${label}`}
            className="text-sm font-semibold text-violet-600 hover:text-violet-700 hover:underline decoration-violet-300 underline-offset-4 dark:text-violet-400 dark:hover:text-violet-300 dark:decoration-violet-900"
          >
            {linkText}
          </Link>
        ) : (
          <span
            className={cn('text-sm font-medium', {
              'text-slate-900 dark:text-slate-100': value,
              'text-slate-400 italic dark:text-slate-500': !value,
            })}
          >
            {displayValue}
          </span>
        )}
      </div>
    </div>
  );
};
