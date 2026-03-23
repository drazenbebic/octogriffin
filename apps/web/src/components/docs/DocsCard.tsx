import { FC, ReactNode } from 'react';
import NextLink from 'next/link';

import clsx from 'clsx';
import { ArrowRight01Icon } from 'hugeicons-react';

import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';

export type DocsCardProps = {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
};

export const DocsCard: FC<DocsCardProps> = ({
  href,
  title,
  description,
  icon,
}) => (
  <NextLink
    href={href}
    className={clsx(
      'group relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 ease-in-out',
      'hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-900/5',
      'dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-800 dark:hover:shadow-violet-900/10',
    )}
  >
    <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-colors group-hover:bg-violet-50 group-hover:text-violet-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-violet-950/50 dark:group-hover:text-violet-400">
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
      Read more <ArrowRight01Icon size={16} className="ml-1" />
    </div>
  </NextLink>
);
