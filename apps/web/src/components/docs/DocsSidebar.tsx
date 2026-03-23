'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import clsx from 'clsx';

import { docsNavigation } from '@/config/docsNavigation';

export const DocsSidebar: FC = () => {
  const pathname = usePathname();

  return (
    <nav className="w-full">
      <div className="flex flex-col gap-8">
        {docsNavigation.map(section => (
          <div key={section.title}>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {section.title}
            </h4>
            <ul className="flex flex-col gap-1">
              {section.items.map(item => {
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={clsx(
                        'group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                        isActive
                          ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-200'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-100',
                      )}
                    >
                      <span
                        className={clsx(
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
