'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

import { cn } from '@/utils/cn';

const links = [
  { href: '/docs', label: 'Docs' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/sponsors', label: 'Sponsors' },
  { href: '/faq', label: 'FAQ' },
];

export const Navigation: FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname();

  return (
    <nav className={cn('flex items-center gap-6', className)}>
      {links.map(({ href, label }) => {
        const isActive =
          href === '/' ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            className={cn(
              'text-sm font-medium transition-colors hover:text-violet-600 dark:hover:text-violet-400',
              isActive
                ? 'text-violet-600 dark:text-violet-400'
                : 'text-slate-600 dark:text-slate-400',
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
