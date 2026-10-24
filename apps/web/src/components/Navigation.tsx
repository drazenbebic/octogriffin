'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';

import { cn } from '@/utils/cn';

export const navigationLinks = [
  { description: 'Guides and setup', href: '/docs', label: 'Docs' },
  {
    description: 'Ready-made triggers',
    href: '/docs/coding-habits',
    label: 'Recipes',
  },
  { description: "What's coming next", href: '/roadmap', label: 'Roadmap' },
  { description: 'Who keeps it free', href: '/sponsors', label: 'Sponsors' },
  { description: 'Common questions', href: '/faq', label: 'FAQ' },
];

/** The most specific link matching the current page, so Docs and Recipes don't both light up. */
export const activeNavigationHref = (pathname: string): string | undefined =>
  navigationLinks
    .filter(({ href }) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

export const Navigation: FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname() ?? '';
  const activeHref = activeNavigationHref(pathname);

  return (
    <nav aria-label="Main" className={cn('flex h-full gap-1', className)}>
      {navigationLinks.map(({ href, label }) => {
        const isActive = href === activeHref;

        return (
          <Link
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex items-center px-3 text-sm transition-colors duration-[var(--dur-fast)] hover:text-text',
              isActive
                ? 'font-semibold text-text shadow-[inset_0_-2px_0_var(--accent-text)]'
                : 'font-medium text-text-2',
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
