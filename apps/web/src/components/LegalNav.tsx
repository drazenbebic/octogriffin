'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';

import { cn } from '@/utils/cn';

const legalPages = [
  { href: '/privacy-policy', label: 'Privacy policy' },
  { href: '/terms-and-conditions', label: 'Terms' },
  { href: '/imprint', label: 'Imprint' },
];

/** Switches between the three legal pages. */
export const LegalNav: FC = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Legal"
      className="inline-flex w-fit gap-0.5 rounded-[12px] border border-border bg-sunken p-1"
    >
      {legalPages.map(({ href, label }) => {
        const isCurrent = pathname === href;

        return (
          <Link
            aria-current={isCurrent ? 'page' : undefined}
            className={cn(
              'flex h-8 items-center rounded-[8px] border px-3 text-[13px] transition-colors duration-[var(--dur-fast)]',
              isCurrent
                ? 'border-border-strong bg-raised font-semibold text-text shadow-lift'
                : 'border-transparent font-medium text-text-2 hover:text-text',
            )}
            href={href}
            key={href}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};
