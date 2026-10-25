'use client';

import type { FC, ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import type { Currency, SponsorTier, SponsorTierId } from '@/config/sponsors';
import { sponsorTiers } from '@/config/sponsors';

type SponsorChoice = {
  /** The visitor's currency, which every amount on the page is shown in. */
  currency: Currency;
  setTierId: (id: SponsorTierId) => void;
  tier: SponsorTier;
};

const SponsorChoiceContext = createContext<null | SponsorChoice>(null);

/**
 * The tier picked on the sponsors page, shared so the upkeep bar in the
 * header can preview what the picker below it would add.
 */
export const SponsorChoiceProvider: FC<{
  children: ReactNode;
  currency: Currency;
}> = ({ children, currency }) => {
  const [tierId, setTierId] = useState<SponsorTierId>('fuel');
  const value = useMemo(
    () => ({
      currency,
      setTierId,
      tier: sponsorTiers.find(tier => tier.id === tierId) ?? sponsorTiers[0],
    }),
    [currency, tierId],
  );

  return (
    <SponsorChoiceContext.Provider value={value}>
      {children}
    </SponsorChoiceContext.Provider>
  );
};

/** Null outside a provider, so the bar still renders without a preview. */
export const useSponsorChoice = () => useContext(SponsorChoiceContext);
