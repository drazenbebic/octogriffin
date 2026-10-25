import type { SponsorTier } from '@/config/sponsors';
import { daysOfHosting, sponsorTiers, upkeepPercent } from '@/config/sponsors';

import { describeSponsorship } from './describeSponsorship';

const tier = (id: SponsorTier['id']) =>
  sponsorTiers.find(candidate => candidate.id === id)!;

const sentence = (parts: ReturnType<typeof describeSponsorship>) =>
  parts.map(part => ('text' in part ? part.text : '')).join('');

describe('describeSponsorship', () => {
  it('says how much of the monthly goal a tier covers', () => {
    expect(sentence(describeSponsorship(tier('fuel'), 'USD', 25))).toBe(
      'When you sponsor $5 a month, Octogriffin keeps the database and the website running and server health goes up 20%.',
    );
  });

  it('swaps the symbol for euro visitors and keeps the number', () => {
    expect(sentence(describeSponsorship(tier('feature'), 'EUR', 25))).toBe(
      'When you sponsor €15 a month, Octogriffin pays for time on the next feature and server health goes up 60%.',
    );
  });

  it('turns a one-time gift into days of hosting', () => {
    expect(sentence(describeSponsorship(tier('once'), 'EUR', 25))).toBe(
      'When you give once, Octogriffin drinks a Health Potion, and every €5 covers about 6 days of hosting.',
    );
  });
});

describe('upkeep', () => {
  it('caps the bar at 100% and fills it when there is no goal', () => {
    expect(upkeepPercent(80, 40)).toBe(100);
    expect(upkeepPercent(5, 0)).toBe(100);
  });

  it('counts at least one day for a small gift', () => {
    expect(daysOfHosting(1, 400)).toBe(1);
    expect(daysOfHosting(5, 0)).toBe(0);
  });
});
