import { WebPage, WithContext } from 'schema-dts';

export const privacyJsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Privacy Policy - Octogriffin',
  description:
    'Our commitment to protecting your code and data. GDPR compliance, zero-storage policy for source code, and secure infrastructure.',
  url: 'https://octogriffin.com/privacy-policy',
  lastReviewed: '2026-01-12',
  mainEntity: {
    '@type': 'CreativeWork',
    name: 'Octogriffin Privacy Policy',
    author: {
      '@type': 'Person',
      name: 'Drazen Bebic',
      url: 'https://bebic.dev',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Octogriffin',
    },
    dateModified: '2026-01-12',
  },
};
