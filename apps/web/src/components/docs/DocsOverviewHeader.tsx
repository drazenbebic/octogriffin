'use client';

import { usePathname } from 'next/navigation';
import type { FC } from 'react';

import { PageHeader } from '@/components/PageHeader';

/** The grain header, only on the docs overview, not on every article. */
export const DocsOverviewHeader: FC = () => {
  if (usePathname() !== '/docs') {
    return null;
  }

  return (
    <PageHeader
      description="Get more out of Octogriffin, set up a local environment, understand the architecture or contribute to the codebase."
      title="Documentation"
    />
  );
};
