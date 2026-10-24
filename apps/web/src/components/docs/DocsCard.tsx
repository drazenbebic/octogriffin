import NextLink from 'next/link';
import type { FC, ReactNode } from 'react';

import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { cn } from '@/utils/cn';

export type DocsCardProps = {
  description: string;
  href: string;
  icon: ReactNode;
  title: string;
};

export const DocsCard: FC<DocsCardProps> = ({
  description,
  href,
  icon,
  title,
}) => (
  <NextLink
    className={cn(
      'group relative flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 shadow-e1 transition-colors duration-[var(--dur-fast)] hover:border-border-strong hover:bg-sunken',
    )}
    href={href}
  >
    <div
      className={cn(
        'mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
        'bg-accent-soft text-accent-text',
      )}
    >
      {icon}
    </div>

    <Heading className="font-bold text-text " level={3} size="lg">
      {title}
    </Heading>

    <Content className="leading-relaxed text-muted " size="sm">
      {description}
    </Content>

    <div className="mt-auto flex items-center pt-4 text-sm font-semibold text-accent-text">
      Read more{' '}
      <HugeiconsIcon className="ml-1" icon={ArrowRight01Icon} size={16} />
    </div>
  </NextLink>
);
