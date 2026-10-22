import type { WebPage, WithContext } from 'schema-dts';

import { OCTOGRIFFIN_ORG } from './shared';

export const sponsorsJsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  description:
    'Support the development of Octogriffin and keep the servers running. Octogriffin is 100% open source and community supported.',
  mainEntity: {
    '@type': 'DonateAction',
    description: 'Support the development and hosting of Octogriffin.',
    recipient: OCTOGRIFFIN_ORG,
    url: 'https://github.com/sponsors/drazenbebic',
  },
  name: 'Sponsors - Octogriffin',
  potentialAction: [
    {
      '@type': 'DonateAction',
      name: 'Sponsor on GitHub',
      target: 'https://github.com/sponsors/drazenbebic',
    },
    {
      '@type': 'DonateAction',
      name: 'Buy me a Coffee',
      target: 'https://ko-fi.com/drazen',
    },
  ],
  url: 'https://octogriffin.com/sponsors',
};
