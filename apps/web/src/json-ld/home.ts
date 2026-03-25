import { WebApplication, WithContext } from 'schema-dts';

import { AUTHOR_PERSON, OCTOGRIFFIN_ORG } from './shared';

export const homeJsonLd: WithContext<WebApplication> = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Octogriffin',
  description:
    'Level up your Habitica character by writing code. Connect GitHub to Habitica and turn commits, PRs, and reviews into XP, Gold, and Loot. Gamify your GitHub workflow automatically.',
  url: 'https://octogriffin.com',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'GitHub and Habitica Integration',
    'Customizable Triggers (Commits, PRs, Reviews)',
    'RPG character leveling through coding',
    'XP, Gold, and Loot rewards',
    'Automatic Habitica task scoring',
    'Repository-specific or global trigger scope',
  ],
  keywords:
    'GitHub, Habitica, gamification, RPG, productivity, software development, automation, RPG character, code rewards',
  screenshot: 'https://octogriffin.com/og-image.png',
  image: 'https://octogriffin.com/og-image.png',
  author: AUTHOR_PERSON,
  publisher: OCTOGRIFFIN_ORG,
  inLanguage: 'en-US',
  isAccessibleForFree: true,
};
