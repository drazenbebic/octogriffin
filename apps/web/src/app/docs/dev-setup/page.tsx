import { Metadata } from 'next';

import clsx from 'clsx';
import {
  CheckmarkCircle02Icon,
  CommandLineIcon,
  Folder01Icon,
  Globe02Icon,
  Settings01Icon,
  Tick02Icon,
} from 'hugeicons-react';

import { DocsFeedback } from '@/components/docs/DocsFeedback';
import { DocsResourceLink } from '@/components/docs/DocsResourceLink';
import { DocsStep } from '@/components/docs/DocsStep';
import { EnvGenerator } from '@/components/docs/EnvGenerator';
import { Link } from '@/components/Link';
import { Alert } from '@/components/ui/Alert';
import { Code } from '@/components/ui/Code';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';
import { generatePageMetadata } from '@/utils/seo';

const GITHUB_PERMISSIONS = [
  { category: 'Actions' },
  { category: 'Contents' },
  { category: 'Discussions' },
  { category: 'Issues' },
  { category: 'Metadata', isMandatory: true },
  { category: 'Packages' },
  { category: 'Pull Requests' },
];

const GITHUB_EVENTS = [
  'Meta',
  'Commit comment',
  'Create',
  'Discussion',
  'Discussion comment',
  'Delete',
  'Fork',
  'Gollum',
  'Issue comment',
  'Issues',
  'Label',
  'Milestone',
  'Pull request',
  'Pull request review',
  'Pull request review comment',
  'Pull request review thread',
  'Push',
  'Registry package',
  'Release',
  'Repository',
  'Star',
  'Workflow dispatch',
  'Workflow job',
  'Workflow run',
  'Sub Issues',
];

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePageMetadata({
    title: 'Development Setup',
    description:
      'Complete guide to setting up Octogriffin locally. Learn how to configure Docker, create a GitHub App, and initialize the database for development.',
    suffix: 'Octogriffin Docs',
    path: 'docs/dev-setup',
  });
};

export default function DocsDevSetupPage() {
  return (
    <div className="max-w-3xl space-y-12 pb-20">
      <div>
        <Heading level={1} className="mb-4">
          Development Setup
        </Heading>
        <Content size="lg">
          To contribute to <strong>Octogriffin</strong>, you need to set up the
          project locally. Follow this guide to get up and running in minutes.
        </Content>
      </div>

      {/* Prerequisites */}
      <section className="space-y-4">
        <Heading level={2} size="xl">
          Prerequisites
        </Heading>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CheckmarkCircle02Icon
              className="text-emerald-500 shrink-0"
              size={24}
            />
            <Content className="font-medium">Node.js 22+</Content>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CheckmarkCircle02Icon
              className="text-emerald-500 shrink-0"
              size={24}
            />
            <Content className="font-medium">Docker (for PostgreSQL)</Content>
          </div>
        </div>
      </section>

      {/* Step 1: Webhook Tunneling */}
      <DocsStep step={1} heading="Expose Localhost">
        <Content>
          GitHub Webhooks require a public URL to reach your machine. Since
          localhost is not accessible from the internet, we use a tunnel.
        </Content>

        <DocsResourceLink
          href="/docs/setting-up-ngrok"
          title="Set up Ngrok Tunnel"
          description="Required to receive webhook events locally."
          icon={<Globe02Icon size={18} />}
        />

        <Alert variant="info" title="Alternatives">
          While we recommend Ngrok for stability, you are free to use
          alternatives like Smee or Localtunnel.
        </Alert>
      </DocsStep>

      {/* Step 2: Create GitHub App */}
      <DocsStep step={2} heading="Create GitHub App">
        <Content>
          Go to{' '}
          <Link href="https://github.com/settings/apps/new" target="_blank">
            Developer Settings &gt; New GitHub App
          </Link>{' '}
          and fill in the details below.
        </Content>

        <div className="space-y-6">
          <div className="space-y-3">
            <Heading level={4} size="base">
              1. General
            </Heading>
            <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/50">
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  GitHub App Name
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                  My GitHub App
                </span>
              </div>
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  Homepage URL
                </span>
                <span className="font-mono text-slate-900 dark:text-slate-300">
                  http://localhost:3000
                </span>
              </div>
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  Callback URL
                </span>
                <div className="flex flex-col gap-1 font-mono text-slate-900 dark:text-slate-300">
                  <span>http://localhost:3000/api/auth/callback/github</span>
                </div>
              </div>
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  Callback URL (2)
                </span>
                <div className="flex flex-col gap-1 font-mono text-slate-900 dark:text-slate-300">
                  <span>
                    <span className="text-violet-600 font-semibold dark:text-violet-400">
                      &lt;YOUR-NGROK-URL&gt;
                    </span>
                    /api/auth/callback/github
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  Setup URL
                </span>
                <span className="font-mono text-slate-900 dark:text-slate-300">
                  http://localhost:3000/dashboard/settings
                </span>
              </div>
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  Webhook URL
                </span>
                <span className="font-mono text-slate-900 dark:text-slate-300">
                  <span className="text-violet-600 font-semibold dark:text-violet-400">
                    &lt;YOUR-NGROK-URL&gt;
                  </span>
                  /api/v1/webhook
                </span>
              </div>
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  Webhook Secret
                </span>
                <span className="text-slate-500 italic dark:text-slate-500">
                  Leave blank (we configure this later)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Heading level={4} size="base">
              2. Permissions
            </Heading>
            <Content>
              Set the following <strong>Repository permissions</strong> to{' '}
              <strong>Read-only</strong>.
            </Content>

            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {GITHUB_PERMISSIONS.map(
                    ({ category, isMandatory = false }) => (
                      <tr
                        key={category}
                        className={clsx({
                          'bg-white dark:bg-slate-950': !isMandatory,
                          'bg-slate-50/50 dark:bg-slate-900/50': isMandatory,
                        })}
                      >
                        <td
                          className={clsx(
                            'px-4 py-2 font-medium dark:text-slate-300',
                          )}
                        >
                          {category} {isMandatory && <>(Mandatory)</>}
                        </td>
                        <td className="px-4 py-2 text-violet-600 font-bold dark:text-violet-400">
                          Read-only
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-3">
            <Heading level={4} size="base">
              3. Subscribe to events
            </Heading>

            <Content>
              Next, scroll down to the <strong>Subscribe to events</strong>{' '}
              section and check the following boxes:
            </Content>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              {GITHUB_EVENTS.map(event => (
                <div
                  key={event}
                  className="flex items-center gap-2.5 rounded-lg bg-white px-3 py-2 text-sm text-slate-700 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800"
                >
                  <Tick02Icon className="text-emerald-500 shrink-0" size={16} />
                  <span className="font-medium">{event}</span>
                </div>
              ))}
            </div>
          </div>

          <Alert variant="warning" title="Important">
            After clicking &quot;Create GitHub App&quot;, locate the{' '}
            <span className="font-mono font-bold">Client ID</span> and generate
            a new <span className="font-mono font-bold">Client Secret</span>.
            You will need them for step 5.
          </Alert>
        </div>
      </DocsStep>

      {/* Step 3: Fork & Clone */}
      <DocsStep step={3} heading="Fork & Clone">
        <Content>
          If you plan to contribute,{' '}
          <Link href={githubRepositoryUrl('/fork')} target="_blank">
            fork the repository
          </Link>{' '}
          first.
        </Content>
        <Code
          code={[
            'git clone https://github.com/YOUR_USERNAME/octogriffin.git',
            'cd octogriffin',
          ]}
          disableNumbers
          language="bash"
        />
      </DocsStep>

      {/* Step 4: Install Dependencies */}
      <DocsStep step={4} heading="Install Dependencies">
        <Content>Install the project dependencies.</Content>
        <Code
          code={['yarn install']}
          disableNumbers
          icon={CommandLineIcon}
          language="bash"
        />
      </DocsStep>

      {/* Step 5: Environment Config */}
      <DocsStep step={5} heading="Configure Environment">
        <div className="space-y-2">
          <Heading className="flex items-center gap-2" size="base" level={4}>
            <Folder01Icon size={16} className="text-slate-400" />
            Copy Configuration Files
          </Heading>
          <Code
            code={[
              'cp .env.example .env',
              'cp apps/web/.env.local.example apps/web/.env.local',
            ]}
            disableNumbers
            language="bash"
          />
          <Alert variant="note">
            The root <code className="font-bold">.env</code> is only used by
            Docker for the database.
          </Alert>
        </div>

        <div className="space-y-2 pt-2">
          <Heading className="flex items-center gap-2" size="base" level={4}>
            <Settings01Icon size={16} className="text-slate-400" />
            Fill <code className="text-sm">apps/web/.env.local</code>
          </Heading>
          <Content>
            Use the generator below to create secure keys. Copy the block into
            your local env file, then fill in the GitHub credentials from Step
            2.
          </Content>
          <div className="mt-3">
            <EnvGenerator />
          </div>
        </div>
      </DocsStep>

      {/* Step 6: Database */}
      <DocsStep step={6} heading="Start Database">
        <Content>Start the PostgreSQL container from the project root.</Content>
        <Code
          code={['docker compose up -d']}
          disableNumbers
          icon={CommandLineIcon}
          language="bash"
        />

        <Alert variant="info">
          If you changed the DB credentials in the root .env, remember to update{' '}
          <code className="font-bold">DB_URL</code> in{' '}
          <code className="font-bold">apps/web/.env.local</code>.
        </Alert>
      </DocsStep>

      {/* Step 7: Prisma Setup */}
      <DocsStep step={7} heading="Initialize Database">
        <Content>
          Run the following commands to generate the client, apply migrations,
          and seed demo data.
        </Content>

        <Code
          code={[
            '# Switch to the web app directory',
            'cd apps/web',
            '',
            '# Generate Prisma Client',
            'prisma generate',
            '',
            '# Push schema to DB',
            'prisma migrate deploy',
            '',
            '# Run Seeder',
            'prisma db seed',
          ]}
          disableNumbers
          language="bash"
        />
      </DocsStep>

      {/* Step 8: Launch */}
      <DocsStep step={8} heading="Launch Server">
        <Content>Everything is ready! Start the development server:</Content>
        <Code
          code={['yarn dev']}
          icon={CommandLineIcon}
          language="bash"
          disableNumbers
        />
        <Content className="mt-4">
          Open{' '}
          <Link href="http://localhost:3000" target="_blank">
            http://localhost:3000
          </Link>{' '}
          to see your app.
        </Content>
      </DocsStep>

      <DocsFeedback />
    </div>
  );
}
