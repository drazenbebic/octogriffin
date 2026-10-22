import type { WebPage, WithContext } from 'schema-dts';

import { pageUrl } from '@/seo/pageCatalog';

import { AUTHOR_PERSON, OCTOGRIFFIN_ORG } from './shared';

export const termsJsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  description:
    'User agreement, usage guidelines, and liability disclaimers for the Octogriffin GitHub integration.',
  lastReviewed: '2026-01-12',
  mainEntity: {
    '@type': 'CreativeWork',
    author: AUTHOR_PERSON,
    dateModified: '2026-01-12',
    datePublished: '2024-09-10',
    name: 'Octogriffin Terms and Conditions',
    publisher: OCTOGRIFFIN_ORG,
  },
  name: 'Terms & Conditions - Octogriffin',
  url: pageUrl('/terms-and-conditions'),
};
