import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowDown02Icon,
  ArrowUpRight01Icon,
  CheckmarkCircle02Icon,
  GithubIcon,
  GitPullRequestIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { JsonLd } from '@/components/JsonLd';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { TriggerSentence } from '@/components/TriggerSentence';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Heading } from '@/components/ui/Heading';
import { Shell } from '@/components/ui/Shell';
import { recipes } from '@/config/recipes';
import { getCurrentPhase } from '@/config/roadmap';
import { homeJsonLd } from '@/json-ld/home';
import { pageMetadata } from '@/seo/pageCatalog';
import { describeTrigger } from '@/utils/describeTrigger';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';

export const metadata: Metadata = pageMetadata('/');

const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';

const steps = [
  {
    body: (
      <>
        Pick the repositories you want to earn rewards from. The app only
        receives webhooks; it can&apos;t change your code.
      </>
    ),
    title: 'Install the GitHub App',
  },
  {
    body: (
      <>
        Sign in and paste your{' '}
        <Link
          className="text-accent-text underline underline-offset-4"
          href="/docs/habitica-api-token"
        >
          Habitica API token
        </Link>
        . It&apos;s encrypted before it reaches the database.
      </>
    ),
    title: 'Link your Habitica account',
  },
  {
    body: (
      <>
        Any of over{' '}
        <Link
          className="text-accent-text underline underline-offset-4"
          href="/docs/supported-github-events"
        >
          100 GitHub events
        </Link>{' '}
        can score a habit. Start from a recipe or build your own trigger.
      </>
    ),
    title: 'Push, merge, review',
  },
];

const rules = [
  [
    'Over 100 events:',
    'commits, pull requests, reviews, releases, issues, discussions',
  ],
  ['Trivial to Hard:', 'difficulty sets how much XP and Gold you get'],
  [
    'Reward or punish:',
    'earn XP and Gold, or lose health for habits you want to break',
  ],
  ['Per repository:', 'separate habits for work and side projects'],
];

const exampleRule = recipes[2].preset;

export default function HomePage() {
  const currentPhase = getCurrentPhase();

  return (
    <>
      <JsonLd data={homeJsonLd} />
      <div className="flex flex-col gap-20 pt-4 pb-24 sm:gap-28">
        <Shell as="section">
          <div className="arcane grid items-center gap-12 rounded-2xl px-6 py-14 sm:px-14 sm:py-[72px] lg:grid-cols-2">
            <Image
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-28 -bottom-36 h-[620px] w-[620px] max-w-none opacity-[0.07]"
              height={620}
              priority
              src="/octogriffin_white.png"
              width={620}
            />

            <div className="flex flex-col items-start gap-6">
              <Link
                className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 py-1 pr-3 pl-1 text-[13px] text-white transition-colors duration-[var(--dur-fast)] hover:bg-white/15"
                href={githubRepositoryUrl(`/releases/tag/web-v${version}`)}
                rel="noreferrer"
                target="_blank"
              >
                <span className="rounded-full bg-[#f5b544] px-2 py-0.5 font-mono text-xs font-medium text-griffin-900">
                  v{version}
                </span>
                <span>See what&apos;s new</span>
              </Link>

              <Heading
                className="text-white"
                color="inherit"
                level={1}
                size="display-xl"
              >
                Turn your GitHub commits into Habitica gold and XP
              </Heading>

              <p className="max-w-[46ch] text-lg text-white/80">
                Octogriffin is a free, open-source Habitica GitHub integration.
                Level up your character, find items and slay monsters just by
                writing code.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  render={<Link href="/installation" />}
                  size="lg"
                  variant="onGrain"
                >
                  <HugeiconsIcon icon={GithubIcon} size={18} />
                  Install the GitHub App
                </Button>
                <Button
                  className="border border-white/35 bg-transparent text-white shadow-none hover:bg-white/10"
                  render={<Link href="/docs" />}
                  size="lg"
                  variant="secondary"
                >
                  Read the docs
                </Button>
              </div>
            </div>

            <figure
              aria-label="Example: opening a pull request scores a habit"
              className="flex w-full max-w-[440px] flex-col gap-3.5 justify-self-center lg:justify-self-end"
            >
              <div className="flex items-center gap-3.5 rounded-lg border border-white/10 bg-black/50 px-[18px] py-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white/10">
                  <HugeiconsIcon icon={GitPullRequestIcon} size={20} />
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="text-sm font-semibold">
                    You opened a pull request
                  </span>
                  <span className="truncate font-mono text-xs text-white/65">
                    pull_request.opened
                  </span>
                </div>
              </div>
              <HugeiconsIcon
                aria-hidden="true"
                className="self-center text-white/50"
                icon={ArrowDown02Icon}
                size={20}
              />
              <div className="overflow-hidden rounded-lg bg-white text-[#19161f] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.55)]">
                <div className="h-1 bg-[linear-gradient(90deg,#7853be,#432879_60%,#f5b544)]" />
                <div className="flex items-center gap-3.5 px-[18px] py-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#e3f3ea] text-[#187a50]">
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={20} />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold">
                      Habit scored: Opened a pull request
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
                      <span className="rounded-sm bg-[#fbf1de] px-2 py-0.5 text-[#a86700]">
                        + XP
                      </span>
                      <span className="rounded-sm bg-[#fbf4d9] px-2 py-0.5 text-[#8a6a00]">
                        + Gold
                      </span>
                      <span className="rounded-sm border border-[#e3dfeb] px-2 py-0.5 text-[#4a4459]">
                        Easy <span className="text-[#a86700]">★</span>
                      </span>
                      <span className="rounded-sm bg-[#fbe9ec] px-1.5 py-0.5 font-mono font-medium text-[#d6364a]">
                        STR
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </figure>
          </div>
        </Shell>

        <Shell as="section" className="flex flex-col gap-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Heading level={2} size="h1">
              Set up once, then just code
            </Heading>
            <p className="max-w-[44ch] text-text-2">
              Three steps, about five minutes. After that, Octogriffin listens
              to GitHub and you never have to open it again.
            </p>
          </div>
          <ol className="grid gap-6 border-t border-border md:grid-cols-3">
            {steps.map((step, index) => (
              <li
                className="relative flex flex-col gap-3 pt-7"
                key={step.title}
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-px left-0 h-0.5 w-14 bg-accent"
                />
                <span className="font-mono text-[13px] font-medium text-accent-text">
                  Step {index + 1}
                </span>
                <Heading level={3} size="h3">
                  {step.title}
                </Heading>
                <p className="text-[15px] text-text-2">{step.body}</p>
              </li>
            ))}
          </ol>
        </Shell>

        <Shell as="section" className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <Heading level={2} size="h1">
              You write the rules
            </Heading>
            <p className="max-w-[46ch] text-text-2">
              Every trigger reads like a sentence. Choose the event, the
              repositories, how hard it counts and whether it rewards or
              punishes you.
            </p>
            <ul className="flex flex-col gap-3 text-[15px]">
              {rules.map(([title, body]) => (
                <li className="flex gap-3" key={title}>
                  <HugeiconsIcon
                    className="mt-0.5 shrink-0 text-accent-text"
                    icon={CheckmarkCircle02Icon}
                    size={20}
                  />
                  <span className="text-text-2">
                    <strong className="font-semibold text-text">{title}</strong>{' '}
                    {body}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <figure className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-8 shadow-e2">
            <figcaption className="text-[13px] font-semibold text-muted">
              A trigger
            </figcaption>
            <TriggerSentence
              parts={describeTrigger(exampleRule, {
                repoNames: ['octogriffin', 'bebic.dev', 'side-quest'],
                totalRepos: 3,
              })}
              size="lg"
            />
            <span className="text-[13px] text-muted">
              The same sentence sits at the top of the trigger dialog and
              updates as you edit.
            </span>
          </figure>
        </Shell>

        <Shell as="section" className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-2.5">
              <Heading level={2} size="h1">
                Start from a recipe
              </Heading>
              <p className="max-w-[52ch] text-text-2">
                Ready-made triggers for the habits worth keeping. One click adds
                one to your dashboard.
              </p>
            </div>
            <Link
              className="text-[15px] font-semibold text-accent-text hover:underline"
              href="/docs/coding-habits"
            >
              All recipes
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {recipes.slice(0, 3).map(recipe => (
              <RecipeCard key={recipe.slug} recipe={recipe} />
            ))}
          </div>
        </Shell>

        <Shell as="section">
          <div className="mist grid items-center gap-8 rounded-xl border border-border p-8 sm:p-10 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-2 text-[13px] font-semibold text-accent-text">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_4px_var(--accent-soft)]"
                />
                <span>Now in the forge</span>
              </span>
              <Heading level={2}>{currentPhase.codename}</Heading>
              <p className="max-w-[44ch] text-text-2">{currentPhase.summary}</p>
              <Link
                className="mt-1 w-fit text-[15px] font-semibold text-accent-text hover:underline"
                href="/roadmap"
              >
                See the full roadmap
              </Link>
            </div>
            <ul className="flex flex-col gap-2.5">
              {currentPhase.items.slice(0, 3).map(item => (
                <li
                  className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-4 py-3.5"
                  key={item.title}
                >
                  <span className="text-[15px] font-semibold text-text">
                    {item.title}
                  </span>
                  <Chip
                    tone={item.status === 'in-progress' ? 'accent' : 'neutral'}
                  >
                    {item.status === 'in-progress' ? 'In progress' : 'Planned'}
                  </Chip>
                </li>
              ))}
            </ul>
          </div>
        </Shell>
      </div>
    </>
  );
}
