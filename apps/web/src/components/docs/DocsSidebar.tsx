'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';

import { Heading } from '@/components/ui/Heading';
import { docsNavigation } from '@/config/docsNavigation';
import { cn } from '@/utils/cn';

export const DocsSidebar: FC = () => {
  const pathname = usePathname();

  return (
    <nav className="w-full">
      <div className="flex flex-col gap-8">
        {docsNavigation.map(section => (
          <div key={section.title}>
            <Heading
              className="mb-2 px-3 text-xs font-semibold text-muted"
              color="inherit"
              level={4}
              size="h4"
            >
              {section.title}
            </Heading>
            <ul className="flex flex-col gap-1">
              {section.items.map(item => {
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      className={cn(
                        'group flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-sm font-medium transition-colors duration-[var(--dur-fast)]',
                        isActive
                          ? 'bg-accent-soft text-accent-text '
                          : 'text-text-2 hover:bg-fill hover:text-text',
                      )}
                      href={item.href}
                    >
                      <span
                        className={cn(
                          'transition-colors',
                          isActive
                            ? 'text-accent-text '
                            : 'text-muted group-hover:text-text-2 ',
                        )}
                      >
                        {item.icon}
                      </span>
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
};
