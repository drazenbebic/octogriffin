import './DocsPage.scss';

import { Metadata } from 'next';
import { ReactNode } from 'react';

import { DocsSidebar } from '@/components/docs/DocsSidebar';

export const metadata: Metadata = {
  title: {
    template: '%s | Octogriffin Docs',
    default: 'Octogriffin Docs',
  },
};

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
        <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:py-16">
          <div className="sticky top-docs-sidebar max-h-[calc(100vh-6rem)] overflow-y-auto pr-4">
            <DocsSidebar />
          </div>
        </aside>

        <div className="flex-1 py-16 min-w-0">{children}</div>
      </div>
    </div>
  );
}
