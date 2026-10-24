import type { Metadata } from 'next';
import Link from 'next/link';

import { JsonLd } from '@/components/JsonLd';
import { NowPhase } from '@/components/roadmap/NowPhase';
import { PhaseCard } from '@/components/roadmap/PhaseCard';
import { QuestLine } from '@/components/roadmap/QuestLine';
import { ShippedList } from '@/components/roadmap/ShippedList';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Shell } from '@/components/ui/Shell';
import { getCurrentPhase, roadmap } from '@/config/roadmap';
import { roadmapJsonLd } from '@/json-ld/roadmap';
import { pageMetadata } from '@/seo/pageCatalog';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';

export const metadata: Metadata = pageMetadata('/roadmap');

const legend = [
  { className: 'bg-ok', label: 'Shipped' },
  {
    className: 'bg-accent shadow-[0_0_0_3px_var(--accent-soft)]',
    label: 'In progress',
  },
  { className: 'border-2 border-accent', label: 'Next' },
  {
    className: 'border-2 border-dashed border-faint',
    label: 'Later or exploring',
  },
];

export default function RoadmapPage() {
  const next = roadmap.filter(({ status }) => status === 'next');
  const later = roadmap.filter(
    ({ status }) => status === 'later' || status === 'exploring',
  );
  const shipped = roadmap.filter(({ status }) => status === 'shipped');

  return (
    <>
      <JsonLd data={roadmapJsonLd} />
      <div className="flex flex-col gap-16 pt-16 pb-24 sm:gap-[72px]">
        <Shell className="grid items-end gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Heading level={1} size="display">
              Roadmap
            </Heading>
            <p className="max-w-[50ch] text-lg text-text-2">
              What&apos;s shipped, what&apos;s in the forge and what we&apos;re
              still thinking about. Have an opinion? Vote on the GitHub issues.
            </p>
          </div>
          <ul className="flex flex-wrap gap-4 text-[13px] text-text-2 md:justify-end">
            {legend.map(({ className, label }) => (
              <li className="flex items-center gap-1.5" key={label}>
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-full ${className}`}
                />
                {label}
              </li>
            ))}
          </ul>
        </Shell>

        <Shell>
          <QuestLine phases={roadmap} />
        </Shell>

        <Shell>
          <NowPhase phase={getCurrentPhase()} />
        </Shell>

        <Shell as="section" className="flex flex-col gap-6">
          <Heading level={2}>Next</Heading>
          <div className="grid gap-5 lg:grid-cols-2">
            {next.map(phase => (
              <PhaseCard key={phase.codename} phase={phase} />
            ))}
          </div>
        </Shell>

        <Shell as="section" className="flex flex-col gap-6">
          <Heading level={2}>Later</Heading>
          <div className="grid gap-5 lg:grid-cols-2">
            {later.map(phase => (
              <PhaseCard key={phase.codename} phase={phase} />
            ))}
          </div>
        </Shell>

        <Shell as="section" className="flex flex-col gap-5">
          <Heading level={2}>Shipped</Heading>
          <ShippedList phases={shipped} />
        </Shell>

        <Shell>
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-border bg-surface p-8 shadow-e1">
            <div className="flex flex-col gap-1">
              <Heading level={2} size="h3">
                Missing something?
              </Heading>
              <p className="text-[15px] text-text-2">
                The roadmap follows what people ask for. Open an issue and
                describe the habit you want to build.
              </p>
            </div>
            <Button
              render={
                <Link
                  href={githubRepositoryUrl('/issues/new')}
                  rel="noreferrer"
                  target="_blank"
                />
              }
              size="lg"
            >
              Request a feature
            </Button>
          </div>
        </Shell>
      </div>
    </>
  );
}
