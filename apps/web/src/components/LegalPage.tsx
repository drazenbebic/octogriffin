import { FC, ReactNode } from 'react';

import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';

export type LegalPageProps = {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
};

export const LegalPage: FC<LegalPageProps> = ({
  title,
  subtitle,
  children,
}) => (
  <div className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
    <div className="mb-10 border-b border-slate-200 pb-8 dark:border-slate-800">
      <Heading level={1} className="mb-4">
        {title}
      </Heading>
      <Content size="lg">{subtitle}</Content>
    </div>
    {children}
  </div>
);
