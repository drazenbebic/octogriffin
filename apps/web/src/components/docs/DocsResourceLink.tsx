import Link from 'next/link';
import { FC, ReactNode } from 'react';

import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/Button';
import { Content } from '@/components/ui/Content';
import { cn } from '@/utils/cn';

export type DocsResourceLinkProps = {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  label?: string;
  className?: string;
};

export const DocsResourceLink: FC<DocsResourceLinkProps> = ({
  href,
  title,
  description,
  icon,
  label = 'View Guide',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
          <div className="text-violet-600 shrink-0 flex items-center dark:text-violet-400">
            {icon}
          </div>
          <span>{title}</span>
        </div>
        <Content color="note" size="sm">
          {description}
        </Content>
      </div>

      <Button
        className="shrink-0"
        render={<Link href={href} />}
        size="sm"
        variant="secondary"
      >
        {label}
        <HugeiconsIcon
          className="text-slate-400 dark:text-slate-500"
          icon={ArrowRight01Icon}
          size={16}
        />
      </Button>
    </div>
  );
};
