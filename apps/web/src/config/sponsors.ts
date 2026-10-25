export const githubSponsorsUrl = 'https://github.com/sponsors/drazenbebic';
export const kofiUrl = 'https://ko-fi.com/drazen';

export type Currency = 'EUR' | 'USD';

/**
 * What the servers cost a month, the same 300 a year as the Ko-fi goal. The
 * health bar fills towards it.
 */
export const upkeep = {
  covers: 'Neon, Vercel and domains',
  goal: 25,
};

/**
 * Visitors see their own currency symbol on the same numbers: $5 and €5 are
 * treated as equal to keep the page simple.
 */
export const formatMoney = (amount: number, currency: Currency) =>
  `${currency === 'EUR' ? '€' : '$'}${amount}`;

export type SponsorTierId = 'coffee' | 'feature' | 'fuel' | 'once';
export type MonthlyTierId = Exclude<SponsorTierId, 'once'>;

// The lists below are kept by hand until the page reads GitHub Sponsors and
// Ko-fi itself. Only add people whose support is public.

export type MonthlySponsor = {
  /** The GitHub username, which also gives the avatar. */
  login: string;
  name: string;
  tierId: MonthlyTierId;
};

/** Everyone sponsoring monthly. All are listed; the tier sets the size. */
export const monthlySponsors: MonthlySponsor[] = [];

export type OneTimeSupporter = {
  name: string;
  /** Everything they gave once in the last 12 months. */
  total: number;
  url?: string;
  via: 'GitHub Sponsors' | 'Ko-fi';
};

/** Public one-time gifts from the last 12 months; drop older ones. */
export const oneTimeSupporters: OneTimeSupporter[] = [
  {
    name: 'Sofie',
    total: 5,
    url: 'https://ko-fi.com/Y8Y61WWFJP',
    via: 'Ko-fi',
  },
];

/** One-time gifts received this calendar month. */
export const oneTimeThisMonth = 0;

export type SponsorTier = {
  /** A month, or once for the one-time gift. */
  amount: number;
  /** What the money does, finishing "Octogriffin …". */
  effect: string;
  id: SponsorTierId;
  name: string;
  perks: string[];
};

export const sponsorTiers: SponsorTier[] = [
  {
    amount: 2,
    effect: 'buys a coffee for the weekend bug hunt',
    id: 'coffee',
    name: 'Coffee fund',
    perks: [
      'Your name in the README and on this page',
      'Sponsor badge on your GitHub profile',
      'My eternal gratitude 🫶',
    ],
  },
  {
    amount: 5,
    effect: 'keeps the database and the website running',
    id: 'fuel',
    name: 'Server fuel',
    perks: [
      'Your avatar and name in the README and on this page',
      'Sponsor badge on your GitHub profile',
      'My eternal gratitude 🫶',
    ],
  },
  {
    amount: 15,
    effect: 'pays for time on the next feature',
    id: 'feature',
    name: 'Feature backer',
    perks: [
      'A large avatar and link at the top of both lists',
      'Priority on your feature requests',
      'Sponsor badge on your GitHub profile',
      'My eternal gratitude 🫶',
    ],
  },
  {
    // One coffee on Ko-fi
    amount: 5,
    effect: 'drinks a Health Potion',
    id: 'once',
    name: 'Health Potion',
    perks: [
      'Any amount, no commitment',
      'Listed as a Potion brewer for a year, if your gift is public',
      'My eternal gratitude 🫶',
    ],
  },
];

const tierAmount = (id: SponsorTierId) =>
  sponsorTiers.find(tier => tier.id === id)?.amount ?? 0;

/** Recurring sponsorships a month. */
export const monthlyTotal = (sponsors = monthlySponsors) =>
  sponsors.reduce((total, sponsor) => total + tierAmount(sponsor.tierId), 0);

/** Monthly sponsors grouped by tier, biggest first, empty tiers left out. */
export const sponsorsByTier = (sponsors = monthlySponsors) =>
  sponsorTiers
    .filter(tier => tier.id !== 'once')
    .sort((a, b) => b.amount - a.amount)
    .map(tier => ({
      sponsors: sponsors.filter(sponsor => sponsor.tierId === tier.id),
      tier,
    }))
    .filter(group => group.sponsors.length > 0);

/** One-time supporters by how much they gave. */
export const topOneTimeSupporters = (
  supporters = oneTimeSupporters,
  limit = 10,
) => [...supporters].sort((a, b) => b.total - a.total).slice(0, limit);

/** The share of the monthly goal an amount covers, 0–100. */
export const upkeepPercent = (amount: number, goal = upkeep.goal) =>
  goal > 0 ? Math.min(100, Math.round((amount / goal) * 100)) : 100;

/** How many days of hosting a one-time amount pays for. */
export const daysOfHosting = (amount: number, goal = upkeep.goal) =>
  goal > 0 ? Math.max(1, Math.round((amount / goal) * 30)) : 0;
