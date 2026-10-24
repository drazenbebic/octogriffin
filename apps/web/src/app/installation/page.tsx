import type { Metadata } from 'next';
import Link from 'next/link';

import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  GithubIcon,
  Key01Icon,
  Rocket01Icon,
  Settings02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { JsonLd } from '@/components/JsonLd';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { installationJsonLd } from '@/json-ld/installation';
import { pageMetadata } from '@/seo/pageCatalog';
import { githubAppUrl } from '@/utils/githubAppUrl';

export const metadata: Metadata = pageMetadata('/installation');

const GITHUB_APP_PERMISSIONS = [
  'Actions',
  'Contents',
  'Discussions',
  'Issues',
  'Metadata',
  'Packages',
  'Pull requests',
];

export default function InstallationPage() {
  return (
    <>
      <JsonLd data={installationJsonLd} />
      <div className="mx-auto max-w-2xl space-y-12 pb-20 pt-10 sm:pt-20 px-4">
        <div className="text-center">
          <Chip className="mb-4" shape="pill" tone="accent">
            <HugeiconsIcon icon={Rocket01Icon} size={14} />
            Quick start
          </Chip>
          <Heading className="mb-4" level={1}>
            Connect GitHub to Habitica
          </Heading>
          <Content size="lg">
            Follow these steps to connect your GitHub activity to your Habitica
            character.
          </Content>
        </div>

        <div className="relative space-y-8">
          <div className="absolute left-6.75 top-4 bottom-4 w-0.5 bg-border" />

          {/* Step 1: Install */}
          <div className="relative">
            <div className="relative z-10 flex gap-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-white shadow-lg ">
                <HugeiconsIcon icon={GithubIcon} size={28} />
              </div>

              <div className="pt-1.5 pb-8">
                <Heading className="text-text " level={3} size="h3">
                  Install the App
                </Heading>
                <Content className="mt-2 mb-4" size="sm">
                  Begin by installing the GitHub App on your account. This
                  grants us permission to listen to your commits securely.
                </Content>
                <Link
                  className="inline-block"
                  href={githubAppUrl()}
                  target="_blank"
                >
                  <Button className="shadow-xl " size="lg">
                    Install the GitHub App
                    <HugeiconsIcon
                      className="opacity-60"
                      icon={ArrowRight01Icon}
                      size={16}
                    />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Step 2: Repositories */}
          <div className="relative">
            <div className="relative z-10 flex gap-6">
              <Card
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border text-text-2 shadow-sm "
                variant="sunken"
              >
                <span className="font-bold">2</span>
              </Card>
              <div className="pt-2 pb-6">
                <Heading
                  className="flex items-center gap-2 text-text "
                  level={3}
                  size="h4"
                >
                  Select Repositories
                  <HugeiconsIcon
                    className="text-mp"
                    icon={CheckmarkCircle02Icon}
                    size={18}
                  />
                </Heading>
                <Content className="mt-2" size="sm">
                  During installation, choose <strong>All Repositories</strong>{' '}
                  or select specific projects you want to gamify.
                </Content>
              </div>
            </div>
          </div>

          {/* Step 3: Credentials */}
          <div className="relative">
            <div className="relative z-10 flex gap-6">
              <Card
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border text-text-2 shadow-sm "
                variant="sunken"
              >
                <span className="font-bold">3</span>
              </Card>
              <div className="pt-2 pb-6">
                <Heading
                  className="flex items-center gap-2 text-text "
                  level={3}
                  size="h4"
                >
                  Enter Credentials
                  <HugeiconsIcon
                    className="text-xp"
                    icon={Key01Icon}
                    size={18}
                  />
                </Heading>
                <Content className="mt-2" size="sm">
                  You will be redirected to the dashboard. Enter your Habitica{' '}
                  <strong>User ID</strong> and <strong>API Token</strong>.{' '}
                  <Link
                    className="font-semibold text-accent-text hover:underline "
                    href="/docs/habitica-api-token"
                  >
                    Where do I find them?
                  </Link>
                </Content>
              </div>
            </div>
          </div>

          {/* Step 4: Triggers */}
          <div className="relative">
            <div className="relative z-10 flex gap-6">
              <Card
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border text-text-2 shadow-sm "
                variant="sunken"
              >
                <span className="font-bold">4</span>
              </Card>
              <div className="pt-2">
                <Heading
                  className="flex items-center gap-2 text-text "
                  level={3}
                  size="h4"
                >
                  Set Triggers
                  <HugeiconsIcon
                    className="text-ok"
                    icon={Settings02Icon}
                    size={18}
                  />
                </Heading>
                <Content className="mt-2 mb-4" size="sm">
                  Finally, map GitHub events to rewards to start earning. Each
                  trigger scores a Habitica habit, which Octogriffin creates for
                  you if it doesn&apos;t exist yet. Need ideas? Start with the{' '}
                  <Link
                    className="font-semibold text-accent-text hover:underline "
                    href="/docs/coding-habits"
                  >
                    coding habit recipes
                  </Link>
                  .
                </Content>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <Heading level={2} size="h3">
            Check that it works
          </Heading>
          <Content>
            Push a commit to one of the repositories you picked for a trigger.
            Within a few seconds the event appears in the{' '}
            <strong>History</strong> tab of your{' '}
            <Link
              className="font-semibold text-accent-text hover:underline "
              href="/dashboard/history"
            >
              dashboard
            </Link>
            , and the habit is scored in Habitica. History only lists events
            that earned a reward, so if nothing shows up, check that the trigger
            is active and covers that repository. The{' '}
            <Link
              className="font-semibold text-accent-text hover:underline "
              href="/faq"
            >
              FAQ
            </Link>{' '}
            covers the most common problems.
          </Content>
        </section>

        <section className="space-y-4">
          <Heading level={2} size="h3">
            What the GitHub App can access
          </Heading>
          <Content>
            Octogriffin asks GitHub for <strong>read-only</strong> access to
            these repository permissions, and never for write access:
          </Content>
          <Card className="p-5" variant="outlined">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              {GITHUB_APP_PERMISSIONS.map(permission => (
                <Content
                  as="li"
                  className="flex items-center gap-2"
                  key={permission}
                  size="sm"
                >
                  <HugeiconsIcon
                    className="shrink-0 text-ok"
                    icon={CheckmarkCircle02Icon}
                    size={16}
                  />
                  {permission}
                </Content>
              ))}
            </ul>
          </Card>
          <Content>
            GitHub only sends push events to apps that can read a
            repository&apos;s contents. Octogriffin uses the event details
            GitHub sends, like who pushed and how many commits, and keeps only a
            record of which events earned you rewards. It never stores your code
            or commit messages.
          </Content>
        </section>
      </div>
    </>
  );
}
