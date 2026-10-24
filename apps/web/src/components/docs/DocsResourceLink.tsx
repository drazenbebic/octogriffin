import Link from 'next/link';
import type { FC, ReactNode } from 'react';

import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/Button';
import { Content } from '@/components/ui/Content';
import { cn } from '@/utils/cn';

export type DocsResourceLinkProps = {
  className?: string;
  description: string;
  href: string;
  icon: ReactNode;
  label?: string;
  title: string;
};

export const DocsResourceLink: FC<DocsResourceLinkProps> = ({
  className,
  description,
  href,
  icon,
  label = 'View Guide',
  title,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-sunken p-5 sm:flex-row sm:items-center ',
        className,
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2 font-bold text-text ">
          <div className="text-accent-text shrink-0 flex items-center ">
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
          className="text-muted "
          icon={ArrowRight01Icon}
          size={16}
        />
      </Button>
    </div>
  );
};
