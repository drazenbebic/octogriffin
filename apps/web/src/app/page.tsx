import { Metadata, NextPage } from 'next';
import Link from 'next/link';

import {
  ArrowRight01Icon,
  Calendar03Icon,
  CheckmarkCircle01Icon,
  GitBranchIcon,
  GitCommitIcon,
  GithubIcon,
  GitMergeIcon,
  Rocket01Icon,
  Settings01Icon,
  StarIcon,
  Target02Icon,
} from 'hugeicons-react';

import { RewardRow } from '@/components/RewardRow';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CardBody } from '@/components/ui/CardBody';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { Pill } from '@/components/ui/Pill';
import { githubAppUrl } from '@/utils/githubAppUrl';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';

export const metadata: Metadata = {
  title: 'Octogriffin - Gamify Your GitHub Workflow',
  description:
    'Level up your RPG character automatically while you code. Connect GitHub to Habitica and turn commits, PRs, and reviews into XP, Gold, and Loot.',
  openGraph: {
    title: 'Octogriffin - Gamify Your GitHub Workflow',
    description:
      'Turn your code commits into RPG rewards. Open source and secure.',
  },
};

const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';

const Home: NextPage = () => {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <section className="relative px-4 pt-20 sm:pt-32 text-center">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
          <Pill
            variant="shiny"
            href={githubRepositoryUrl(`/releases/tag/web-v${version}`)}
            target="_blank"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
            </span>

            <span className="font-medium text-slate-600 group-hover:text-violet-700 transition-colors">
              v{version} is now live
            </span>

            <span className="h-3 w-px bg-slate-200 group-hover:bg-violet-200 transition-colors"></span>

            <span className="flex items-center gap-1 text-slate-400 group-hover:text-violet-600 transition-colors">
              <span className="text-xs font-medium">Changelog</span>
              <ArrowRight01Icon
                size={14}
                className="-ml-1 translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
              />
            </span>
          </Pill>

          <Heading level={1} size="4xl">
            Turn your Commits into <br />
            <span className="text-violet-600">Gold and XP</span>
          </Heading>

          <Content size="lg" className="max-w-2xl text-center">
            Connect your GitHub Account to our Octogriffin App. Level up your
            Habitica character, find items, and slay monsters just by writing
            code.
          </Content>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href={githubAppUrl()} target="_blank">
              <Button size="lg">
                Get Started
                <ArrowRight01Icon size={20} className="ml-2" />
              </Button>
            </Link>
            <Link href={githubRepositoryUrl()} target="_blank">
              <Button variant="secondary" size="lg">
                <GithubIcon size={20} className="mr-2" />
                Open Source
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-16 text-center">
          <Heading level={2} size="3xl" className="tracking-tight">
            How it works
          </Heading>
          <Content className="mt-4" size="lg">
            Simple, secure, and set-and-forget.
          </Content>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          <div className="absolute top-[50%] left-0 hidden w-full px-16 md:block">
            <div className="h-0.5 w-full border-t-2 border-dashed border-slate-200" />
          </div>

          <Card
            variant="elevated"
            isHoverable
            className="shadow-blue-900/5! hover:shadow-blue-900/20!"
          >
            <CardBody className="items-center text-center">
              <div className="relative mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-50 to-blue-100 text-blue-600 shadow-inner ring-4 ring-white">
                <GithubIcon size={32} />
                <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white ring-2 ring-white">
                  1
                </div>
              </div>
              <Heading level={3} size="lg">
                Install App
              </Heading>
              <Content size="sm">
                Install our GitHub App on your repositories. We only listen to
                webhooks.
              </Content>
            </CardBody>
          </Card>

          <Card variant="elevated" isHoverable>
            <CardBody className="items-center text-center">
              <div className="relative mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-violet-50 to-violet-100 text-violet-600 shadow-inner ring-4 ring-white">
                <CheckmarkCircle01Icon size={32} />
                <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white ring-2 ring-white">
                  2
                </div>
              </div>
              <Heading level={3} size="lg">
                Link Account
              </Heading>
              <Content size="sm">
                Sign in and add your Habitica API keys. Your data is encrypted
                at rest.
              </Content>
            </CardBody>
          </Card>

          <Card
            variant="elevated"
            isHoverable
            className="shadow-emerald-900/5! hover:shadow-emerald-900/20!"
          >
            <CardBody className="items-center text-center">
              <div className="relative mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-50 to-emerald-100 text-emerald-600 shadow-inner ring-4 ring-white">
                <GitMergeIcon size={32} />
                <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white ring-2 ring-white">
                  3
                </div>
              </div>
              <Heading level={3} size="lg">
                Get Rewards
              </Heading>
              <Content size="sm">
                Push code, merge PRs, or review code. Watch your character gain
                XP automatically.
              </Content>
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 text-center">
        <Card
          variant="outlined"
          className="relative overflow-hidden border-violet-200 bg-linear-to-b from-white via-violet-50/30 to-violet-100/30 shadow-xs"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] bg-size-[20px_20px] opacity-[0.04]"></div>

          <div className="pointer-events-none absolute -left-8 -top-8 text-violet-200/60 opacity-50">
            <StarIcon size={80} className="-rotate-12" />
          </div>
          <div className="pointer-events-none absolute -bottom-8 -right-8 text-violet-200/60 opacity-50">
            <Target02Icon size={80} className="rotate-12" />
          </div>

          <CardBody className="relative z-10 flex flex-col items-center px-6 py-12 sm:px-12">
            <Pill
              variant="neutral"
              className="mb-4 inline-flex items-center gap-1.5 border-violet-200 bg-white/80 shadow-xs backdrop-blur-sm"
            >
              <Rocket01Icon size={14} className="shrink-0" />
              <Content
                color="violet"
                as="span"
                size="sm"
                className="font-semibold"
              >
                Upcoming Features
              </Content>
            </Pill>

            <Heading level={2} size="3xl" className="mb-4">
              We are just{' '}
              <span className="text-violet-600">getting started.</span>
            </Heading>

            <Content size="lg" className="mx-auto mb-8 max-w-lg">
              We have ambitious plans to make your workflow even more immersive.
              See what features are currently in the forge.
            </Content>

            <Link href="/roadmap">
              <Button size="lg" className="shadow-lg shadow-violet-200/50">
                <Calendar03Icon size={20} className="mr-2" />
                View Roadmap
              </Button>
            </Link>
          </CardBody>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4">
        <Card variant="elevated">
          <CardBody>
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-6">
              <div>
                <Heading level={2} size="xl">
                  You are the Game Master
                </Heading>
                <Content size="sm">
                  Forget hardcoded values. With the new{' '}
                  <span className="font-semibold text-violet-600">
                    Control Freak
                  </span>{' '}
                  update, you define the rules.
                </Content>
              </div>
              <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-violet-50 text-violet-600 sm:flex">
                <Settings01Icon size={20} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <RewardRow
                icon={<GitCommitIcon size={20} className="text-emerald-500" />}
                action="Triggers"
                reward="Commits, PRs, Merges & Reviews, and muuuuuch more!"
                badgeVariant="success"
              />
              <RewardRow
                icon={<Target02Icon size={20} className="text-blue-500" />}
                action="Difficulty"
                reward="Trivial, Easy, Medium or Hard"
                badgeVariant="info"
              />
              <RewardRow
                icon={<StarIcon size={20} className="text-amber-500" />}
                action="Rewards"
                reward="Reward with XP/Gold, or lose Health!"
                badgeVariant="warning"
              />
              <RewardRow
                icon={<GitBranchIcon size={20} className="text-violet-500" />}
                action="Scope"
                reward="Global or Repository specific"
              />
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
};

export default Home;
