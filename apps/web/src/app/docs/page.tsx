import { Metadata } from 'next';

import {
  CodeCircleIcon,
  GithubIcon,
  GitPullRequestIcon,
  Globe02Icon,
  Settings02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { DocsCard } from '@/components/docs/DocsCard';
import { JsonLd } from '@/components/JsonLd';
import { Callout } from '@/components/ui/Callout';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { docsIndexJsonLd } from '@/json-ld/docs';
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
    <>
      <JsonLd data={docsIndexJsonLd} />
      <div className="space-y-12">
        {/* Hero Section */}
        <div>
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
            icon={<HugeiconsIcon icon={Settings02Icon} size={24} />}
            color="violet"
          />
          <DocsCard
            href="/docs/setting-up-ngrok"
            title="Ngrok Setup"
            description="Expose your localhost to GitHub webhooks securely using Ngrok static domains."
            icon={<HugeiconsIcon icon={Globe02Icon} size={24} />}
            color="sky"
          />
          <DocsCard
            href="/docs/how-to-contribute"
            title="Contributing Guide"
            description="Learn how to open PRs, follow our coding standards, and use the design system."
            icon={<HugeiconsIcon icon={GitPullRequestIcon} size={24} />}
            color="emerald"
          />
          <DocsCard
            href="/docs/architecture"
            title="Architecture"
            description="Deep dive into how Next.js, Vercel, and Neon DB work together with GitHub Webhooks."
            icon={<HugeiconsIcon icon={CodeCircleIcon} size={24} />}
            color="amber"
          />
        </div>

        <Callout
          title="Need Help?"
          headingLevel={3}
          description="If you can't find what you're looking for, check our GitHub Issues or reach out directly."
          button={{
            label: 'View GitHub Issues',
            href: githubRepositoryUrl('/issues'),
            icon: GithubIcon,
            isExternal: true,
          }}
        />
      </div>
    </>
  );
}
