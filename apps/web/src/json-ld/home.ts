import type { WebApplication, WithContext } from 'schema-dts';

import { ogImageUrl, pageUrl } from '@/seo/pageCatalog';

import { AUTHOR_PERSON, OCTOGRIFFIN_ORG } from './shared';

export const homeJsonLd: WithContext<WebApplication> = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  applicationCategory: 'DeveloperApplication',
  author: AUTHOR_PERSON,
  description:
    'Level up your Habitica character by writing code. Connect GitHub to Habitica and turn commits, PRs, and reviews into XP, Gold, and Loot. Gamify your GitHub workflow automatically.',
  featureList: [
    'GitHub and Habitica Integration',
    'Customizable Triggers (Commits, PRs, Reviews)',
    'RPG character leveling through coding',
    'XP, Gold, and Loot rewards',
    'Automatic Habitica task scoring',
    'Repository-specific or global trigger scope',
  ],
  image: ogImageUrl,
  inLanguage: 'en-US',
  isAccessibleForFree: true,
  keywords:
    'GitHub, Habitica, gamification, RPG, productivity, software development, automation, RPG character, code rewards',
  name: 'Octogriffin',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  operatingSystem: 'Any',
  publisher: OCTOGRIFFIN_ORG,
  screenshot: ogImageUrl,
  url: pageUrl('/'),
};
