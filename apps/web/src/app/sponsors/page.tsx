import type { Metadata } from 'next';
import Link from 'next/link';

import {
  ChampionIcon,
  Coffee02Icon,
  FavouriteIcon,
  Rocket01Icon,
  ZapIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { JsonLd } from '@/components/JsonLd';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CardBody } from '@/components/ui/CardBody';
import { Chip } from '@/components/ui/Chip';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { Shell } from '@/components/ui/Shell';
import { sponsorsJsonLd } from '@/json-ld/sponsors';
import { pageMetadata } from '@/seo/pageCatalog';

export const metadata: Metadata = pageMetadata('/sponsors');

export default function SponsorsPage() {
  return (
    <>
      <JsonLd data={sponsorsJsonLd} />
      <Shell className="py-20">
        <div className="mb-16 flex flex-col items-center text-center">
          <Chip className="mb-6" shape="pill" tone="accent">
            <HugeiconsIcon
              className="fill-hp text-hp"
              icon={FavouriteIcon}
              size={14}
            />
            Community supported
          </Chip>

          <Heading className="mb-4" level={1} size="display">
            Fuel the Octogriffin
          </Heading>

          <Content className="max-w-xl" size="lg">
            Octogriffin is 100% open source and free to use. Your sponsorship
            helps cover server costs (Vercel & Neon) and ensures dedicated
            development time for new features.
          </Content>
        </div>

        <div className="mx-auto mb-20 max-w-2xl">
          <Card className="mist relative overflow-hidden" variant="elevated">
            <div className="pointer-events-none absolute -right-12 -top-12 opacity-5">
              <HugeiconsIcon icon={ChampionIcon} size={200} />
            </div>

            <CardBody className="flex flex-col items-center py-12 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent-text ring-4 ring-surface">
                <HugeiconsIcon icon={Rocket01Icon} size={32} />
              </div>

              <Heading className="mb-2" level={2} size="2xl">
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
                    className="border-[#D63E9A] bg-[#EA4AAA] shadow-lg shadow-rose-200/50 hover:bg-[#D63E9A]! "
                    size="lg"
                  >
                    <HugeiconsIcon
                      className="fill-white/20"
                      icon={FavouriteIcon}
                      size={20}
                    />
                    Sponsor on GitHub
                  </Button>
                </Link>
                <Link href="https://ko-fi.com/drazen" target="_blank">
                  <Button size="lg" variant="secondary">
                    <HugeiconsIcon icon={Coffee02Icon} size={20} />
                    Buy me a Coffee
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card
            className="transition-colors hover:border-stone-300 "
            variant="outlined"
          >
            <CardBody>
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-stone-100 p-2 text-stone-600 ">
                  <HugeiconsIcon icon={Coffee02Icon} size={24} />
                </div>
                <span className="text-xl font-bold text-text ">$2 / mo</span>
              </div>
              <Heading className="mb-2" level={3} size="lg">
                Coffee Fund
              </Heading>
              <Content className="mb-6 min-h-20" size="sm">
                You use Octogriffin and it works. This is a &quot;thank
                you&quot; to help keep my caffeine levels up while I fix bugs on
                weekends.
              </Content>
              <ul className="space-y-3">
                <Content as="li" className="flex items-center gap-2" size="sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-stone-400 " />
                  Sponsor badge on profile
                </Content>
                <Content as="li" className="flex items-center gap-2" size="sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-stone-400 " />
                  My gratitude! 🫶
                </Content>
              </ul>
            </CardBody>
          </Card>

          <Card
            className="transition-colors hover:border-xp/30 "
            variant="outlined"
          >
            <CardBody>
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-xp-soft p-2 text-xp ">
                  <HugeiconsIcon
                    className="fill-amber-600 "
                    icon={ZapIcon}
                    size={24}
                  />
                </div>
                <span className="text-xl font-bold text-text ">$5 / mo</span>
              </div>
              <Heading className="mb-2" level={3} size="lg">
                Server Fuel
              </Heading>
              <Content className="mb-6 min-h-20" size="sm">
                You are literally keeping the lights on. This covers your share
                of the Neon database and Vercel hosting costs.
              </Content>
              <ul className="space-y-3">
                <Content as="li" className="flex items-center gap-2" size="sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-xp" />
                  <strong>Listed in README</strong>
                </Content>
                <Content as="li" className="flex items-center gap-2" size="sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-xp" />
                  Sponsor badge on profile
                </Content>
                <Content as="li" className="flex items-center gap-2" size="sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-xp" />
                  My gratitude! 🫶
                </Content>
              </ul>
            </CardBody>
          </Card>

          <Card
            className="border-griffin-200 bg-accent-soft transition-colors hover:border-griffin-200 "
            variant="outlined"
          >
            <CardBody>
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-accent-soft p-2 text-accent-text ">
                  <HugeiconsIcon icon={ChampionIcon} size={24} />
                </div>
                <span className="text-xl font-bold text-accent-text ">
                  $15 / mo
                </span>
              </div>
              <Heading className="mb-2" level={3} size="lg">
                Feature Backer
              </Heading>
              <Content className="mb-6 min-h-20" size="sm">
                You are serious about gamifying your life. This tier supports
                active development time for complex features.
              </Content>
              <ul className="space-y-3">
                <Content as="li" className="flex items-center gap-2" size="sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <strong>Listed on Website</strong>
                </Content>
                <Content as="li" className="flex items-center gap-2" size="sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Priority feature requests
                </Content>
                <Content as="li" className="flex items-center gap-2" size="sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Listed in README
                </Content>
                <Content as="li" className="flex items-center gap-2" size="sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Sponsor badge + Gratitude 🫶
                </Content>
              </ul>
            </CardBody>
          </Card>
        </div>
      </Shell>
    </>
  );
}
