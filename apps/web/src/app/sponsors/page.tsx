import { Metadata } from 'next';
import Link from 'next/link';

import {
  ChampionIcon,
  Coffee02Icon,
  FavouriteIcon,
  Rocket01Icon,
  ZapIcon,
} from 'hugeicons-react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CardBody } from '@/components/ui/CardBody';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { Pill } from '@/components/ui/Pill';
import { TextAccent } from '@/components/ui/TextAccent';
import { generatePageMetadata } from '@/utils/seo';

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePageMetadata({
    title: 'Sponsors',
    description:
      'Support the development of Octogriffin and keep the servers running.',
    path: 'sponsors',
  });
};

export default function SponsorsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <div className="mb-16 flex flex-col items-center text-center">
        <Pill variant="accent" className="mb-6">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">
            <FavouriteIcon size={14} className="text-rose-500 fill-rose-500" />
            Community Supported
          </span>
        </Pill>

        <Heading level={1} size="4xl" className="mb-4 tracking-tight">
          Fuel the{' '}
          <TextAccent variant="brand" breathing>
            Octogriffin!
          </TextAccent>
        </Heading>

        <Content size="lg" className="max-w-xl">
          Octogriffin is 100% open source and free to use. Your sponsorship
          helps cover server costs (Vercel & Neon) and ensures dedicated
          development time for new features.
        </Content>
      </div>

      <div className="mx-auto mb-20 max-w-2xl">
        <Card
          variant="elevated"
          className="relative overflow-hidden border-violet-100 bg-linear-to-b from-white to-violet-50/50 dark:border-violet-900/50 dark:from-slate-900 dark:to-violet-950/20"
        >
          <div className="pointer-events-none absolute -right-12 -top-12 opacity-5 dark:opacity-10 dark:text-violet-400">
            <ChampionIcon size={200} />
          </div>

          <CardBody className="flex flex-col items-center py-12 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-600 ring-4 ring-white dark:bg-violet-900/30 dark:text-violet-400 dark:ring-slate-900">
              <Rocket01Icon size={32} />
            </div>

            <Heading level={2} size="2xl" className="mb-2">
              Be the First!
            </Heading>

            <Content className="mb-8 max-w-md">
              There are currently no active sponsors. Grab the spot, become a
              legend, and get your name immortalized on this page and in our
              README.
            </Content>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="https://github.com/sponsors/drazenbebic"
                target="_blank"
              >
                <Button
                  size="lg"
                  className="border-[#D63E9A] bg-[#EA4AAA] shadow-lg shadow-rose-200/50 hover:bg-[#D63E9A]! dark:shadow-none"
                >
                  <FavouriteIcon size={20} className="fill-white/20" />
                  Sponsor on GitHub
                </Button>
              </Link>
              <Link href="https://ko-fi.com/drazen" target="_blank">
                <Button variant="secondary" size="lg">
                  <Coffee02Icon size={20} />
                  Buy me a Coffee
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card
          variant="outlined"
          className="transition-colors hover:border-stone-300 dark:hover:border-stone-700"
        >
          <CardBody>
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-stone-100 p-2 text-stone-600 dark:bg-stone-900 dark:text-stone-400">
                <Coffee02Icon size={24} />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                $2 / mo
              </span>
            </div>
            <Heading level={3} size="lg" className="mb-2">
              Coffee Fund
            </Heading>
            <Content size="sm" className="mb-6 min-h-20">
              You use Octogriffin and it works. This is a &quot;thank you&quot;
              to help keep my caffeine levels up while I fix bugs on weekends.
            </Content>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-400 dark:bg-stone-600" />
                Sponsor badge on profile
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-400 dark:bg-stone-600" />
                My gratitude! 🫶
              </li>
            </ul>
          </CardBody>
        </Card>

        <Card
          variant="outlined"
          className="transition-colors hover:border-amber-300 dark:hover:border-amber-900/50"
        >
          <CardBody>
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <ZapIcon
                  size={24}
                  className="fill-amber-600 dark:fill-amber-400"
                />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                $5 / mo
              </span>
            </div>
            <Heading level={3} size="lg" className="mb-2">
              Server Fuel
            </Heading>
            <Content size="sm" className="mb-6 min-h-20">
              You are literally keeping the lights on. This covers your share of
              the Neon database and Vercel hosting costs.
            </Content>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <strong>Listed in README</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Sponsor badge on profile
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                My gratitude! 🫶
              </li>
            </ul>
          </CardBody>
        </Card>

        <Card
          variant="outlined"
          className="border-violet-200 bg-violet-50/10 transition-colors hover:border-violet-300 dark:border-violet-900/50 dark:hover:border-violet-800"
        >
          <CardBody>
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-violet-100 p-2 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                <ChampionIcon size={24} />
              </div>
              <span className="text-xl font-bold text-violet-600 dark:text-violet-400">
                $15 / mo
              </span>
            </div>
            <Heading level={3} size="lg" className="mb-2">
              Feature Backer
            </Heading>
            <Content size="sm" className="mb-6 min-h-20">
              You are serious about gamifying your life. This tier supports
              active development time for complex features.
            </Content>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                <strong>Listed on Website</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                Priority feature requests
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                Listed in README
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                Sponsor badge + Gratitude 🫶
              </li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
