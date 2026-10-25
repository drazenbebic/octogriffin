import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader';
import { PotionBrewers } from '@/components/sponsors/PotionBrewers';
import { SponsorChoiceProvider } from '@/components/sponsors/SponsorChoice';
import { SponsorParty } from '@/components/sponsors/SponsorParty';
import { SponsorPicker } from '@/components/sponsors/SponsorPicker';
import { UpkeepBar } from '@/components/sponsors/UpkeepBar';
import { Shell } from '@/components/ui/Shell';
import { monthlySponsors, oneTimeSupporters } from '@/config/sponsors';
import { sponsorsJsonLd } from '@/json-ld/sponsors';
import { pageMetadata } from '@/seo/pageCatalog';
import { currencyFromHeaders } from '@/utils/viewerCurrency';

export const metadata: Metadata = pageMetadata('/sponsors');

export default async function SponsorsPage() {
  // Every amount is shown in the visitor's currency, by country
  const currency = currencyFromHeaders(await headers());

  return (
    <SponsorChoiceProvider currency={currency}>
      <JsonLd data={sponsorsJsonLd} />
      <PageHeader
        aside={<UpkeepBar className="w-full sm:w-[420px]" />}
        description="Octogriffin is free and open source. The servers aren't, so sponsors keep its health bar up and pay for the time that goes into new features."
        title="Fuel the Octogriffin"
      />
      <Shell className="flex flex-col gap-20 py-16 sm:gap-24">
        <SponsorPicker />
        <div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
          <SponsorParty sponsors={monthlySponsors} />
          <PotionBrewers supporters={oneTimeSupporters} />
        </div>
      </Shell>
    </SponsorChoiceProvider>
  );
}
