import './DocsPage.scss';

import type { ReactNode } from 'react';

import { DocsOverviewHeader } from '@/components/docs/DocsOverviewHeader';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { Shell } from '@/components/ui/Shell';

export default function DocsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <DocsOverviewHeader />
      <Shell>
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:py-16">
            <div className="sticky top-docs-sidebar max-h-[calc(100vh-6rem)] overflow-y-auto pr-4">
              <DocsSidebar />
            </div>
          </aside>

          <div className="min-w-0 flex-1 py-16">{children}</div>
        </div>
      </Shell>
    </>
  );
}
