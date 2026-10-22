import type { WebPage, WithContext } from 'schema-dts';

import { pageUrl } from '@/seo/pageCatalog';

export const privacyJsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  description:
    'Our commitment to protecting your code and data. GDPR compliance, zero-storage policy for source code, and secure infrastructure.',
  lastReviewed: '2026-01-12',
  mainEntity: {
    '@type': 'CreativeWork',
    author: {
      '@type': 'Person',
      name: 'Drazen Bebic',
      url: 'https://bebic.dev',
    },
    dateModified: '2026-01-12',
    name: 'Octogriffin Privacy Policy',
    publisher: {
      '@type': 'Organization',
      name: 'Octogriffin',
    },
  },
  name: 'Privacy Policy - Octogriffin',
  url: pageUrl('/privacy-policy'),
};
