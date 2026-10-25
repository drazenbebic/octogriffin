import { render, screen } from '@testing-library/react';

import type { MonthlySponsor, OneTimeSupporter } from '@/config/sponsors';
import { monthlyTotal, topOneTimeSupporters } from '@/config/sponsors';

import { PotionBrewers } from './PotionBrewers';
import { SponsorParty } from './SponsorParty';

const sponsors: MonthlySponsor[] = [
  { login: 'ada', name: 'Ada', tierId: 'coffee' },
  { login: 'grace', name: 'Grace', tierId: 'feature' },
  { login: 'linus', name: 'Linus', tierId: 'fuel' },
];

const supporter = (name: string, total: number): OneTimeSupporter => ({
  name,
  total,
  via: 'Ko-fi',
});

describe('SponsorParty', () => {
  it('lists every monthly sponsor, biggest tier first', () => {
    render(<SponsorParty sponsors={sponsors} />);

    const tiers = screen
      .getAllByRole('heading', { level: 3 })
      .map(heading => heading.textContent);

    expect(tiers).toEqual(['Feature backer', 'Server fuel', 'Coffee fund']);
    expect(screen.getByRole('link', { name: 'Ada' }).getAttribute('href')).toBe(
      'https://github.com/ada',
    );
  });

  it('offers the first seat while no one sponsors', () => {
    render(<SponsorParty sponsors={[]} />);

    screen.getByText('Take the first seat');
  });

  it('adds the tiers up to the monthly total', () => {
    expect(monthlyTotal(sponsors)).toBe(22);
  });
});

describe('PotionBrewers', () => {
  it('ranks one-time supporters by total without showing amounts', () => {
    render(
      <PotionBrewers
        supporters={[
          supporter('Small', 3),
          { ...supporter('Sofie', 5), url: 'https://ko-fi.com/Y8Y61WWFJP' },
        ]}
      />,
    );

    const names = screen.getAllByRole('listitem').map(item => item.textContent);

    expect(names).toEqual(['Sofievia Ko-fi', 'Smallvia Ko-fi']);
    expect(
      screen.getByRole('link', { name: 'Sofie' }).getAttribute('href'),
    ).toBe('https://ko-fi.com/Y8Y61WWFJP');
    expect(screen.queryByText(/€|\$/)).toBeNull();
  });

  it('keeps the top ten', () => {
    const many = Array.from({ length: 12 }, (_, index) =>
      supporter(`S${index}`, index),
    );

    expect(topOneTimeSupporters(many)).toHaveLength(10);
    expect(topOneTimeSupporters(many)[0].name).toBe('S11');
  });
});
