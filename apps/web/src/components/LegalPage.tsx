import type { FC, ReactNode } from 'react';

import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';

export type LegalPageProps = {
  children: ReactNode;
  subtitle: ReactNode;
  title: string;
};

export const LegalPage: FC<LegalPageProps> = ({
  children,
  subtitle,
  title,
}) => (
  <div className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
    <div className="mb-10 border-b border-slate-200 pb-8 dark:border-slate-800">
      <Heading className="mb-4" level={1}>
        {title}
      </Heading>
      <Content size="lg">{subtitle}</Content>
    </div>
    {children}
  </div>
);
