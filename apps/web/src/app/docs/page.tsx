import type { Metadata } from 'next';

import {
  CodeCircleIcon,
  GithubIcon,
  GitPullRequestIcon,
  Globe02Icon,
  Key01Icon,
  Settings02Icon,
  Target02Icon,
  ZapIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { DocsCard } from '@/components/docs/DocsCard';
import { JsonLd } from '@/components/JsonLd';
import { Callout } from '@/components/ui/Callout';
import { docsIndexJsonLd } from '@/json-ld/docs';
import { pageMetadata } from '@/seo/pageCatalog';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';

export const metadata: Metadata = pageMetadata('/docs');

export default function DocsPage() {
  return (
    <>
      <JsonLd data={docsIndexJsonLd} />
      <div className="space-y-12">
        <div className="grid gap-6 sm:grid-cols-2">
          <DocsCard
            description="Where Habitica keeps your User ID and API Token, and how to connect them."
            href="/docs/habitica-api-token"
            icon={<HugeiconsIcon icon={Key01Icon} size={24} />}
            title="Habitica API Token"
          />
          <DocsCard
            description="Ready-made triggers for rewarding commits, pull requests, reviews and releases."
            href="/docs/coding-habits"
            icon={<HugeiconsIcon icon={Target02Icon} size={24} />}
            title="Coding Habit Recipes"
          />
          <DocsCard
            description="Every GitHub event you can reward, and how pushes and other events are counted."
            href="/docs/supported-github-events"
            icon={<HugeiconsIcon icon={ZapIcon} size={24} />}
            title="Supported GitHub Events"
          />
          <DocsCard
            description="Get your local environment running. Includes Docker, Prisma, and GitHub App configuration."
            href="/docs/dev-setup"
            icon={<HugeiconsIcon icon={Settings02Icon} size={24} />}
            title="Development Setup"
          />
          <DocsCard
            description="Expose your localhost to GitHub webhooks securely using Ngrok static domains."
            href="/docs/setting-up-ngrok"
            icon={<HugeiconsIcon icon={Globe02Icon} size={24} />}
            title="Ngrok Setup"
          />
          <DocsCard
            description="Learn how to open PRs, follow our coding standards, and use the design system."
            href="/docs/how-to-contribute"
            icon={<HugeiconsIcon icon={GitPullRequestIcon} size={24} />}
            title="Contributing Guide"
          />
          <DocsCard
            description="Deep dive into how Next.js, Vercel, and Neon DB work together with GitHub Webhooks."
            href="/docs/architecture"
            icon={<HugeiconsIcon icon={CodeCircleIcon} size={24} />}
            title="Architecture"
          />
        </div>

        <Callout
          button={{
            href: githubRepositoryUrl('/issues'),
            icon: GithubIcon,
            isExternal: true,
            label: 'View GitHub Issues',
          }}
          description="If you can't find what you're looking for, check our GitHub Issues or reach out directly."
          headingLevel={3}
          title="Need Help?"
        />
      </div>
    </>
  );
}
