import { Metadata } from 'next';
import Link from 'next/link';

import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Shield02Icon,
  StarIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { JsonLd } from '@/components/JsonLd';
import { RoadmapFeatureItem } from '@/components/roadmap/RoadmapFeatureItem';
import { RoadmapPhase } from '@/components/roadmap/RoadmapPhase';
import { Button } from '@/components/ui/Button';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { Pill } from '@/components/ui/Pill';
import { roadmapJsonLd } from '@/json-ld/roadmap';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';
import { generatePageMetadata } from '@/utils/seo';

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePageMetadata({
    title: 'Roadmap',
    description: 'Our development plan for the future of Octogriffin.',
    path: 'roadmap',
  });
};

export default function RoadmapPage() {
  return (
    <>
      <JsonLd data={roadmapJsonLd} />
      <div className="mx-auto max-w-4xl px-4 py-20">
        <div className="mb-16 flex flex-col items-center text-center">
          <Heading className="mb-4 tracking-tight" level={1} size="4xl">
            The{' '}
            <span className="bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Master Plan
            </span>
          </Heading>

          <Content className="max-w-xl" size="lg">
            We are building the ultimate RPG workflow tool. Here is a look at
            the features currently in the forge.
          </Content>

          <Pill className="mt-6" variant="accent">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">
              <HugeiconsIcon icon={Calendar03Icon} size={14} />
              Public Roadmap
            </span>
          </Pill>
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="hidden absolute left-8 top-4 bottom-4 w-px bg-linear-to-b from-emerald-500 via-violet-200 to-transparent md:block dark:via-violet-900/50" />

          <div className="space-y-12">
            <RoadmapPhase
              colorClass="text-emerald-600 bg-emerald-100 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50"
              dotClass="bg-emerald-500 ring-emerald-200 dark:ring-emerald-900/50"
              icon={<HugeiconsIcon icon={CheckmarkCircle02Icon} size={24} />}
              phase="Phase 1: Control Freak"
              status="Completed"
            >
              <RoadmapFeatureItem
                description="Full control over the cause-and-effect pipeline. Map specific GitHub Webhooks to specific Habitica Habits with Directions, and Priorities."
                tags={['Live', 'Customization']}
                title="Advanced Event Triggers"
              />
              <RoadmapFeatureItem
                description="Define triggers that apply globally to your whole account, or restrict them to specific repositories only."
                tags={['Live', 'Architecture']}
                title="Granular Scoping"
              />
            </RoadmapPhase>

            <RoadmapPhase
              colorClass="text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50"
              dotClass="bg-blue-500 ring-blue-200 dark:ring-blue-900/50"
              icon={<HugeiconsIcon icon={Shield02Icon} size={24} />}
              isActive
              phase="Phase 2: Anti-Cheese"
              status="Next Up"
            >
              <RoadmapFeatureItem
                description="Optional limits to prevent burnout and discourage spamming commits just for gold."
                tags={['Planned']}
                title="Daily XP Caps"
              />
              <RoadmapFeatureItem
                description="Automatically filter out low-effort commits (e.g. empty commits, self-approved PRs within 1 minute)."
                title="Smart Spam Detection"
              />
            </RoadmapPhase>

            <RoadmapPhase
              colorClass="text-violet-600 bg-violet-100 border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900/50"
              dotClass="bg-violet-500 ring-violet-200 dark:ring-violet-900/50"
              icon={<HugeiconsIcon icon={StarIcon} size={24} />}
              phase="Phase 3: Gamification"
              status="Future Concepts"
            >
              <RoadmapFeatureItem
                description="Bonus rewards for consistent contributions over consecutive days."
                title="Coding Streaks"
              />
              <RoadmapFeatureItem
                description="Small chance for 2x XP on significant tasks (e.g. closing >3 issues at once)."
                title="'Critical Hit' Bonuses"
              />
              <RoadmapFeatureItem
                description="A transparent history log showing exactly why and when you received XP."
                title="The Activity Ledger"
              />
            </RoadmapPhase>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center justify-center gap-4 border-t border-slate-100 pt-12 text-center dark:border-slate-800">
          <div>
            <Heading className="mb-2" level={3} size="xl">
              Have a better idea?
            </Heading>
            <Content size="sm">
              Our roadmap is driven by developers like you.
            </Content>
          </div>
          <Link href={githubRepositoryUrl('/issues')} target="_blank">
            <Button size="lg" variant="primary">
              Submit Feature Request
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
