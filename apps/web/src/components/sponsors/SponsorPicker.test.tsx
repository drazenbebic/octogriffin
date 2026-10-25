import { fireEvent, render, screen } from '@testing-library/react';

import type { Currency } from '@/config/sponsors';
import { githubSponsorsUrl, kofiUrl } from '@/config/sponsors';

import { SponsorChoiceProvider } from './SponsorChoice';
import { SponsorPicker } from './SponsorPicker';
import { UpkeepBar } from './UpkeepBar';

const renderPage = (currency: Currency = 'USD') =>
  render(
    <SponsorChoiceProvider currency={currency}>
      <UpkeepBar />
      <SponsorPicker />
    </SponsorChoiceProvider>,
  );

const segments = () =>
  screen
    .getAllByRole('radio')
    .map(radio => radio.closest('label')!.textContent);

describe('SponsorPicker', () => {
  it('starts on Server fuel, with GitHub first and Ko-fi beside it', () => {
    renderPage();

    const links = screen.getAllByRole('link');

    expect(links[0].getAttribute('href')).toBe(githubSponsorsUrl);
    expect(links[0].textContent).toContain('Sponsor $5 a month');
    expect(links[1].getAttribute('href')).toBe(kofiUrl);
    screen.getByText('Your avatar and name in the README and on this page');
    screen.getByText('+$5');
  });

  it('puts Ko-fi first for a one-time gift and keeps GitHub on the page', () => {
    renderPage();

    fireEvent.click(screen.getByRole('radio', { name: 'Health Potion' }));

    const links = screen.getAllByRole('link');

    expect(links[0].getAttribute('href')).toBe(kofiUrl);
    expect(links[1].getAttribute('href')).toBe(githubSponsorsUrl);
    expect(links[1].textContent).toContain('Give once on GitHub');
    screen.getByText('Any amount, no commitment');
    screen.getByText('+$5 once');
  });

  it('shows dollars to dollar visitors', () => {
    renderPage('USD');

    expect(segments()).toEqual(['$2', '$5', '$15', 'Once']);
    expect(
      screen
        .getByRole('meter', { name: 'Server health' })
        .getAttribute('aria-valuetext'),
    ).toBe('$0 of $25 a month covered');
  });

  it('shows the same numbers in euros to euro visitors', () => {
    renderPage('EUR');

    expect(segments()).toEqual(['€2', '€5', '€15', 'Once']);
    expect(screen.getAllByRole('link')[0].textContent).toBe(
      'Sponsor €5 a month',
    );
    expect(
      screen
        .getByRole('meter', { name: 'Server health' })
        .getAttribute('aria-valuetext'),
    ).toBe('€0 of €25 a month covered');
  });
});
