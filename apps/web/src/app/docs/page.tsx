import { Metadata } from 'next';
import NextLink from 'next/link';

import {
  CodeCircleIcon,
  GitPullRequestIcon,
  Globe02Icon,
  Settings02Icon,
} from 'hugeicons-react';

import { DocsCard } from '@/components/docs/DocsCard';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';
import { generatePageMetadata } from '@/utils/seo';

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePageMetadata({
    title: 'Introduction',
    description:
      'The complete guide to Octogriffin. Explore documentation for installation, configuration, architecture, and contributing to the open-source codebase.',
    suffix: 'Octogriffin Docs',
    path: 'docs',
  });
};

export default function DocsPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="space-y-4 border-b border-slate-100 pb-10 dark:border-slate-800">
        <Heading level={1}>Octogriffin Documentation</Heading>
        <Content size="lg" className="max-w-2xl">
          Welcome to the knowledge base. Whether you want to set up your local
          environment, understand the architecture, or contribute to the
          codebase, you are in the right place.
        </Content>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <DocsCard
          href="/docs/dev-setup"
          title="Development Setup"
          description="Get your local environment running. Includes Docker, Prisma, and GitHub App configuration."
          icon={<Settings02Icon size={24} />}
        />
        <DocsCard
          href="/docs/setting-up-ngrok"
          title="Ngrok Setup"
          description="Expose your localhost to GitHub webhooks securely using Ngrok static domains."
          icon={<Globe02Icon size={24} />}
        />
        <DocsCard
          href="/docs/contributing"
          title="Contributing Guide"
          description="Learn how to open PRs, follow our coding standards, and use the design system."
          icon={<GitPullRequestIcon size={24} />}
        />
        <DocsCard
          href="/docs/architecture"
          title="Architecture"
          description="Deep dive into how Next.js, Vercel, and Neon DB work together with GitHub Webhooks."
          icon={<CodeCircleIcon size={24} />}
        />
      </div>

      {/* Help Section */}
      <div className="rounded-2xl bg-slate-50 p-8 text-center dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
        <Heading level={3} size="xl" className="mb-2">
          Need Help?
        </Heading>
        <Content className="mb-6">
          If you can&#39;t find what you&#39;re looking for, check our GitHub
          Issues or reach out directly.
        </Content>
        <NextLink
          href={githubRepositoryUrl('/issues')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:ring-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-700"
        >
          View GitHub Issues
        </NextLink>
      </div>
    </div>
  );
}
