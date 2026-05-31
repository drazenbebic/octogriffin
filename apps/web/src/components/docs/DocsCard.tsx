import { FC, ReactNode } from 'react';
import NextLink from 'next/link';

import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { cn } from '@/utils/cn';

export type DocsCardColor = 'violet' | 'indigo' | 'sky' | 'emerald' | 'amber';

export type DocsCardProps = {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  color?: DocsCardColor;
};

const iconStyles: Record<DocsCardColor, string> = {
  violet:
    'bg-violet-100 text-violet-600 ring-1 ring-violet-200 group-hover:bg-violet-200 group-hover:text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 dark:ring-violet-400/20 dark:group-hover:bg-violet-500/20 dark:group-hover:text-violet-300',
  indigo:
    'bg-indigo-100 text-indigo-600 ring-1 ring-indigo-200 group-hover:bg-indigo-200 group-hover:text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-400/20 dark:group-hover:bg-indigo-500/20 dark:group-hover:text-indigo-300',
  sky: 'bg-sky-100 text-sky-600 ring-1 ring-sky-200 group-hover:bg-sky-200 group-hover:text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-400/20 dark:group-hover:bg-sky-500/20 dark:group-hover:text-sky-300',
  emerald:
    'bg-emerald-100 text-emerald-600 ring-1 ring-emerald-200 group-hover:bg-emerald-200 group-hover:text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20 dark:group-hover:bg-emerald-500/20 dark:group-hover:text-emerald-300',
  amber:
    'bg-amber-100 text-amber-600 ring-1 ring-amber-200 group-hover:bg-amber-200 group-hover:text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-400/20 dark:group-hover:bg-amber-500/20 dark:group-hover:text-amber-300',
};

export const DocsCard: FC<DocsCardProps> = ({
  href,
  title,
  description,
  icon,
  color = 'violet',
}) => (
  <NextLink
    href={href}
    className={cn(
      'group relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 ease-in-out',
      'hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-900/5',
      'dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-800 dark:hover:shadow-violet-900/10',
    )}
  >
    <div
      className={cn(
        'mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
        iconStyles[color],
      )}
    >
      {icon}
    </div>

    <Heading
      level={3}
      size="lg"
      className="font-bold text-slate-900 dark:text-slate-100"
    >
      {title}
    </Heading>

    <Content
      size="sm"
      className="leading-relaxed text-slate-500 dark:text-slate-400"
    >
      {description}
    </Content>

    <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-violet-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-violet-400">
      Read more{' '}
      <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1" />
    </div>
  </NextLink>
);
