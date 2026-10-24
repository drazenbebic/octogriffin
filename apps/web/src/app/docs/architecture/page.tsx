import type { Metadata } from 'next';

import {
  CloudServerIcon,
  Database01Icon,
  GitPullRequestIcon,
  Globe02Icon,
  Layout01Icon,
  LockKeyIcon,
  Shield01Icon,
  ZapIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { DocsFeedback } from '@/components/docs/DocsFeedback';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { pageMetadata } from '@/seo/pageCatalog';

export const metadata: Metadata = pageMetadata('/docs/architecture');

export default function DocsArchitecturePage() {
  return (
    <div className="max-w-3xl space-y-12 pb-20">
      {/* Header */}
      <div>
        <Heading className="mb-4" level={1}>
          Architecture
        </Heading>
        <Content size="lg">
          Octogriffin is a modern full-stack application built on the{' '}
          <strong>Next.js</strong> framework. It acts as a bridge between GitHub
          activity and Habitica gamification.
        </Content>
      </div>

      {/* Tech Stack Grid */}
      <section className="space-y-4">
        <Heading level={2} size="h3">
          Technology Stack
        </Heading>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-5" variant="outlined">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent-text ">
              <HugeiconsIcon icon={Layout01Icon} size={20} />
            </div>
            <Heading level={3} size="h4">
              App Router (Frontend)
            </Heading>
            <Content className="mt-1" size="sm">
              Next.js 16 using React Server Components. Styled with Tailwind CSS
              and Hugeicons.
            </Content>
          </Card>

          <Card className="p-5" variant="outlined">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-ok-soft text-ok ">
              <HugeiconsIcon icon={CloudServerIcon} size={20} />
            </div>
            <Heading level={3} size="h4">
              Serverless Backend
            </Heading>
            <Content className="mt-1" size="sm">
              API Routes and Webhook handlers running on Vercel Serverless
              Functions.
            </Content>
          </Card>

          <Card className="p-5" variant="outlined">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-mp-soft text-mp ">
              <HugeiconsIcon icon={Database01Icon} size={20} />
            </div>
            <Heading level={3} size="h4">
              Data Layer
            </Heading>
            <Content className="mt-1" size="sm">
              Neon (Serverless PostgreSQL) managed via Prisma ORM for type-safe
              database access.
            </Content>
          </Card>

          <Card className="p-5" variant="outlined">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-xp-soft text-xp ">
              <HugeiconsIcon icon={LockKeyIcon} size={20} />
            </div>
            <Heading level={3} size="h4">
              Authentication
            </Heading>
            <Content className="mt-1" size="sm">
              NextAuth.js handling GitHub OAuth sessions and secure session
              management.
            </Content>
          </Card>
        </div>
      </section>

      {/* The Data Flow */}
      <section className="space-y-6">
        <Heading level={2} size="h3">
          Event Data Flow
        </Heading>
        <Content>
          The core of Octogriffin is the transformation of code activity into
          game stats. Here is the lifecycle of a typical event:
        </Content>

        <div className="relative space-y-8 pl-4 before:absolute before:left-10.75 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-fill ">
          {/* Step 1 */}
          <div className="relative flex gap-6">
            <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-text text-bg shadow-md ring-4 ring-bg ">
              <HugeiconsIcon icon={GitPullRequestIcon} size={24} />
            </div>
            <div className="pt-2">
              <Heading className="font-bold" level={4} size="h4">
                GitHub Event
              </Heading>
              <Content size="sm">
                User pushes code or merges a PR. GitHub sends a POST payload to{' '}
                <code className="rounded bg-fill px-1 py-0.5 text-xs font-medium ">
                  /api/v1/webhook
                </code>
                .
              </Content>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex gap-6">
            <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-text ring-4 ring-bg ">
              <HugeiconsIcon icon={Shield01Icon} size={24} />
            </div>
            <div className="pt-2">
              <Heading className="font-bold" level={4} size="h4">
                Security Check
              </Heading>
              <Content size="sm">
                The application validates the{' '}
                <code className="text-xs font-bold ">X-Hub-Signature-256</code>{' '}
                header against our App Secret to ensure the request is
                legitimate.
              </Content>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex gap-6">
            <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-text ring-4 ring-bg ">
              <HugeiconsIcon icon={ZapIcon} size={24} />
            </div>
            <div className="pt-2">
              <Heading className="font-bold" level={4} size="h4">
                Trigger Matching
              </Heading>
              <Content size="sm">
                The system queries the database for active triggers that match
                the incoming event (e.g., &quot;Push to Main&quot;). If a match
                is found, the configured XP/Gold reward is retrieved.
              </Content>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative flex gap-6">
            <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-mp text-white shadow-md ring-4 ring-bg ">
              <HugeiconsIcon icon={Globe02Icon} size={24} />
            </div>
            <div className="pt-2">
              <Heading className="font-bold" level={4} size="h4">
                Habitica Sync
              </Heading>
              <Content size="sm">
                Using the user&#39;s stored API credentials, Octogriffin sends a
                score task request to the Habitica API.
              </Content>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Details */}
      <section className="space-y-4">
        <Heading level={2} size="h3">
          Integration Model
        </Heading>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <Heading className="mb-2" level={3} size="h4">
              GitHub Actor
            </Heading>
            <Content size="sm">
              Octogriffin operates as a{' '}
              <strong className="text-text ">GitHub App</strong>. It does not
              use a user&#39;s personal access token. Instead, it acts on its
              own behalf with specific, granular permissions installed on
              repositories.
            </Content>
          </div>
          <div>
            <Heading className="mb-2" level={3} size="h4">
              Habitica Agent
            </Heading>
            <Content size="sm">
              For Habitica, the app acts as a{' '}
              <strong className="text-text ">User Agent</strong>. We encrypt and
              store the user&#39;s API User ID and Token to make API calls that
              simulate the user completing a task.
            </Content>
          </div>
        </div>
      </section>

      <Alert title="Asynchronous Processing" variant="info">
        To maintain strict performance limits and prevent timeouts,{' '}
        <strong className="text-text ">every webhook</strong> is processed using
        Next.js <code className="font-bold ">after()</code>. This allows us to
        immediately return a{' '}
        <code className="text-xs font-bold ">202 Accepted</code> to GitHub while
        the trigger matching and API sync happen in the background.
      </Alert>

      <DocsFeedback />
    </div>
  );
}
