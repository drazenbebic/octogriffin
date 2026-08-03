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
          <Content className="max-w-2xl" size="lg">
            Welcome to the knowledge base. Whether you want to set up your local
            environment, understand the architecture, or contribute to the
            codebase, you are in the right place.
          </Content>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <DocsCard
            color="violet"
            description="Get your local environment running. Includes Docker, Prisma, and GitHub App configuration."
            href="/docs/dev-setup"
            icon={<HugeiconsIcon icon={Settings02Icon} size={24} />}
            title="Development Setup"
          />
          <DocsCard
            color="sky"
            description="Expose your localhost to GitHub webhooks securely using Ngrok static domains."
            href="/docs/setting-up-ngrok"
            icon={<HugeiconsIcon icon={Globe02Icon} size={24} />}
            title="Ngrok Setup"
          />
          <DocsCard
            color="emerald"
            description="Learn how to open PRs, follow our coding standards, and use the design system."
            href="/docs/how-to-contribute"
            icon={<HugeiconsIcon icon={GitPullRequestIcon} size={24} />}
            title="Contributing Guide"
          />
          <DocsCard
            color="amber"
            description="Deep dive into how Next.js, Vercel, and Neon DB work together with GitHub Webhooks."
            href="/docs/architecture"
            icon={<HugeiconsIcon icon={CodeCircleIcon} size={24} />}
            title="Architecture"
          />
        </div>

        <Callout
          button={{
            label: 'View GitHub Issues',
            href: githubRepositoryUrl('/issues'),
            icon: GithubIcon,
            isExternal: true,
          }}
          description="If you can't find what you're looking for, check our GitHub Issues or reach out directly."
          headingLevel={3}
          title="Need Help?"
        />
      </div>
    </>
  );
}
