import { WebPage, WithContext } from 'schema-dts';

import { AUTHOR_PERSON, OCTOGRIFFIN_ORG } from './shared';

export const termsJsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Terms & Conditions - Octogriffin',
  description:
    'User agreement, usage guidelines, and liability disclaimers for the Octogriffin GitHub integration.',
  url: 'https://octogriffin.com/terms-and-conditions',
  lastReviewed: '2026-01-12',
  mainEntity: {
    '@type': 'CreativeWork',
    name: 'Octogriffin Terms and Conditions',
    author: AUTHOR_PERSON,
    publisher: OCTOGRIFFIN_ORG,
    datePublished: '2024-09-10',
    dateModified: '2026-01-12',
  },
};
