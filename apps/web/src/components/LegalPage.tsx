import type { FC, ReactNode } from 'react';

import { LegalNav } from '@/components/LegalNav';
import { Heading } from '@/components/ui/Heading';
import { Shell } from '@/components/ui/Shell';
import { cn } from '@/utils/cn';

export type LegalSection = {
  id: string;
  label: string;
  level?: 1 | 2;
  /** Legal numbering is a real sequence, so it's shown, e.g. "5.1". */
  number?: string;
};

export type LegalPageProps = {
  children: ReactNode;
  description?: string;
  sections?: LegalSection[];
  title: string;
  /** ISO date, e.g. "2026-10-22". */
  updated?: string;
};

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export const LegalPage: FC<LegalPageProps> = ({
  children,
  description,
  sections = [],
  title,
  updated,
}) => (
  <div className="flex flex-col pb-24">
    <div className="border-b border-border">
      <Shell className="flex flex-col gap-6 pt-16 pb-10">
        <LegalNav />
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <Heading level={1} size="display">
              {title}
            </Heading>
            {!!description && (
              <p className="text-lg text-text-2">{description}</p>
            )}
          </div>
          {!!updated && (
            <p className="text-sm text-muted">
              Last updated{' '}
              <time className="text-text-2" dateTime={updated}>
                {formatDate(updated)}
              </time>
            </p>
          )}
        </div>
      </Shell>
    </div>

    <Shell className="flex flex-wrap items-start gap-16 pt-10">
      {sections.length > 0 && (
        <nav
          aria-label="On this page"
          className="flex flex-[1_1_220px] flex-col gap-0.5 lg:sticky lg:top-24"
        >
          <span className="px-3 pb-2 text-xs font-semibold text-muted">
            On this page
          </span>
          {sections.map(({ id, label, level = 1, number }) => (
            <a
              className={cn(
                'flex gap-2.5 rounded-[8px] py-1.5 pr-3 text-sm transition-colors duration-[var(--dur-fast)] hover:bg-fill hover:text-text',
                level === 2 ? 'pl-7 text-muted' : 'pl-3 text-text-2',
              )}
              href={`#${id}`}
              key={id}
            >
              {!!number && (
                <span className="min-w-[22px] font-mono text-xs leading-5 text-muted">
                  {number}
                </span>
              )}
              {label}
            </a>
          ))}
        </nav>
      )}

      <article className="max-w-measure min-w-0 flex-[999_1_560px] text-text-2 [&_strong]:text-text">
        {children}
      </article>
    </Shell>
  </div>
);
