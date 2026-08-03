'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

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
              className="mb-3 text-xs font-bold uppercase tracking-wider"
              color="slate"
              level={4}
              size="base"
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
                        'group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                        isActive
                          ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-200'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-100',
                      )}
                      href={item.href}
                    >
                      <span
                        className={cn(
                          'transition-colors',
                          isActive
                            ? 'text-violet-600 dark:text-violet-400'
                            : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300',
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
