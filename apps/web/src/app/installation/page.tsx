import { Metadata } from 'next';
import Link from 'next/link';

import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  GithubIcon,
  Key01Icon,
  Rocket01Icon,
  Settings02Icon,
} from 'hugeicons-react';

import { Button } from '@/components/ui/Button';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { githubAppUrl } from '@/utils/githubAppUrl';
import { generatePageMetadata } from '@/utils/seo';

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePageMetadata({
    title: 'Installation',
    description:
      'Get up and running in minutes. Follow our step-by-step guide to install the GitHub App, configure permissions, and link your Habitica account.',
    path: 'installation',
  });
};

export default function InstallationPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-12 pb-20 pt-10 sm:pt-20 px-4">
      <div className="text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-600 dark:border-violet-900/50 dark:bg-violet-950/30 dark:text-violet-400">
          <Rocket01Icon size={14} />
          Quick Start
        </div>
        <Heading level={1} className="mb-4">
          Let&apos;s get you equipped
        </Heading>
        <Content size="lg">
          Follow these steps to connect your GitHub activity to your Habitica
          character.
        </Content>
      </div>

      <div className="relative space-y-8">
        <div className="absolute left-6.75 top-4 bottom-4 w-0.5 bg-linear-to-b from-violet-200 via-slate-200 to-emerald-200 dark:from-violet-900/50 dark:via-slate-800 dark:to-emerald-900/50" />

        {/* Step 1: Install */}
        <div className="relative">
          <div className="relative z-10 flex gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/30">
              <GithubIcon size={28} />
            </div>

            <div className="pt-1.5 pb-8">
              <Heading
                level={3}
                size="lg"
                className="text-slate-900 dark:text-slate-50"
              >
                Install the App
              </Heading>
              <Content size="sm" className="mt-2 mb-4">
                Begin by installing the GitHub App on your account. This grants
                us permission to listen to your commits securely.
              </Content>
              <Link
                href={githubAppUrl()}
                target="_blank"
                className="inline-block"
              >
                <Button
                  size="lg"
                  className="shadow-xl shadow-violet-600/10 hover:shadow-violet-600/20 dark:shadow-none"
                >
                  Install the GitHub App
                  <ArrowRight01Icon size={16} className="opacity-60" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Step 2: Repositories */}
        <div className="relative">
          <div className="relative z-10 flex gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
              <span className="font-bold">2</span>
            </div>
            <div className="pt-2 pb-6">
              <Heading
                level={3}
                size="base"
                className="flex items-center gap-2 text-slate-900 dark:text-slate-50"
              >
                Select Repositories
                <CheckmarkCircle02Icon size={18} className="text-blue-500" />
              </Heading>
              <Content size="sm" className="mt-2">
                During installation, choose <strong>All Repositories</strong> or
                select specific projects you want to gamify.
              </Content>
            </div>
          </div>
        </div>

        {/* Step 3: Credentials */}
        <div className="relative">
          <div className="relative z-10 flex gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
              <span className="font-bold">3</span>
            </div>
            <div className="pt-2 pb-6">
              <Heading
                level={3}
                size="base"
                className="flex items-center gap-2 text-slate-900 dark:text-slate-50"
              >
                Enter Credentials
                <Key01Icon size={18} className="text-amber-500" />
              </Heading>
              <Content size="sm" className="mt-2">
                You will be redirected to the dashboard. Enter your Habitica{' '}
                <strong>User ID</strong> and <strong>API Token</strong> (found
                in Dashboard &gt; Settings).
              </Content>
            </div>
          </div>
        </div>

        {/* Step 4: Triggers */}
        <div className="relative">
          <div className="relative z-10 flex gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
              <span className="font-bold">4</span>
            </div>
            <div className="pt-2">
              <Heading
                level={3}
                size="base"
                className="flex items-center gap-2 text-slate-900 dark:text-slate-50"
              >
                Set Triggers
                <Settings02Icon size={18} className="text-emerald-500" />
              </Heading>
              <Content size="sm" className="mt-2 mb-4">
                Finally, map GitHub events to rewards to start earning.
              </Content>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
