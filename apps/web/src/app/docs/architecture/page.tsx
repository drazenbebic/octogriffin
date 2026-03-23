import { Metadata } from 'next';

import {
  CloudServerIcon,
  Database01Icon,
  GitPullRequestIcon,
  Globe02Icon,
  Layout01Icon,
  LockKeyIcon,
  Shield01Icon,
  ZapIcon,
} from 'hugeicons-react';

import { DocsFeedback } from '@/components/docs/DocsFeedback';
import { Alert } from '@/components/ui/Alert';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { generatePageMetadata } from '@/utils/seo';

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePageMetadata({
    title: 'Architecture',
    description:
      'High-level overview of the Octogriffin technology stack, data flow, and security model.',
    suffix: 'Octogriffin Docs',
    path: 'docs/architecture',
  });
};

export default function DocsArchitecturePage() {
  return (
    <div className="max-w-3xl space-y-12 pb-20">
      {/* Header */}
      <div>
        <Heading level={1} className="mb-4">
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
        <Heading level={2} size="xl">
          Technology Stack
        </Heading>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
              <Layout01Icon size={20} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100">
              App Router (Frontend)
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Next.js 16 using React Server Components. Styled with Tailwind CSS
              and Hugeicons.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
              <CloudServerIcon size={20} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100">
              Serverless Backend
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              API Routes and Webhook handlers running on Vercel Serverless
              Functions.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Database01Icon size={20} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100">
              Data Layer
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Neon (Serverless PostgreSQL) managed via Prisma ORM for type-safe
              database access.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <LockKeyIcon size={20} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100">
              Authentication
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              NextAuth.js handling GitHub OAuth sessions and secure session
              management.
            </p>
          </div>
        </div>
      </section>

      {/* The Data Flow */}
      <section className="space-y-6">
        <Heading level={2} size="xl">
          Event Data Flow
        </Heading>
        <Content>
          The core of Octogriffin is the transformation of code activity into
          game stats. Here is the lifecycle of a typical event:
        </Content>

        <div className="relative space-y-8 pl-4 before:absolute before:left-10.75 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {/* Step 1 */}
          <div className="relative flex gap-6">
            <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-md ring-4 ring-white dark:bg-slate-800 dark:ring-slate-950">
              <GitPullRequestIcon size={24} />
            </div>
            <div className="pt-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                GitHub Event
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                User pushes code or merges a PR. GitHub sends a POST payload to{' '}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-xs font-medium dark:bg-slate-800">
                  /api/v1/webhook
                </code>
                .
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex gap-6">
            <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 ring-4 ring-white dark:bg-violet-900 dark:text-violet-400 dark:ring-slate-950">
              <Shield01Icon size={24} />
            </div>
            <div className="pt-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                Security Check
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                The application validates the{' '}
                <code className="text-xs font-bold dark:text-violet-300">
                  X-Hub-Signature-256
                </code>{' '}
                header against our App Secret to ensure the request is
                legitimate.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex gap-6">
            <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 ring-4 ring-white dark:bg-violet-900 dark:text-violet-400 dark:ring-slate-950">
              <ZapIcon size={24} />
            </div>
            <div className="pt-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                Trigger Matching
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                The system queries the database for active triggers that match
                the incoming event (e.g., &quot;Push to Main&quot;). If a match
                is found, the configured XP/Gold reward is retrieved.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative flex gap-6">
            <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md ring-4 ring-white dark:ring-slate-950">
              <Globe02Icon size={24} />
            </div>
            <div className="pt-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                Habitica Sync
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Using the user&#39;s stored API credentials, Octogriffin sends a
                score task request to the Habitica API.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Details */}
      <section className="space-y-4">
        <Heading level={2} size="xl">
          Integration Model
        </Heading>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <Heading level={3} size="base" className="mb-2">
              GitHub Actor
            </Heading>
            <Content size="sm">
              Octogriffin operates as a{' '}
              <strong className="text-slate-900 dark:text-slate-100">
                GitHub App
              </strong>
              . It does not use a user&#39;s personal access token. Instead, it
              acts on its own behalf with specific, granular permissions
              installed on repositories.
            </Content>
          </div>
          <div>
            <Heading level={3} size="base" className="mb-2">
              Habitica Agent
            </Heading>
            <Content size="sm">
              For Habitica, the app acts as a{' '}
              <strong className="text-slate-900 dark:text-slate-100">
                User Agent
              </strong>
              . We encrypt and store the user&#39;s API User ID and Token to
              make API calls that simulate the user completing a task.
            </Content>
          </div>
        </div>
      </section>

      <Alert variant="info" title="Asynchronous Processing">
        To maintain strict performance limits and prevent timeouts,{' '}
        <strong className="text-slate-900 dark:text-slate-100">
          every webhook
        </strong>{' '}
        is processed using Next.js{' '}
        <code className="font-bold dark:text-blue-300">after()</code>. This
        allows us to immediately return a{' '}
        <code className="text-xs font-bold dark:text-blue-300">
          202 Accepted
        </code>{' '}
        to GitHub while the trigger matching and API sync happen in the
        background.
      </Alert>

      <DocsFeedback />
    </div>
  );
}
