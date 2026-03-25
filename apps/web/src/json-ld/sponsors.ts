import { WebPage, WithContext } from 'schema-dts';

import { OCTOGRIFFIN_ORG } from './shared';

export const sponsorsJsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Sponsors - Octogriffin',
  description:
    'Support the development of Octogriffin and keep the servers running. Octogriffin is 100% open source and community supported.',
  url: 'https://octogriffin.com/sponsors',
  mainEntity: {
    '@type': 'DonateAction',
    recipient: OCTOGRIFFIN_ORG,
    description: 'Support the development and hosting of Octogriffin.',
    url: 'https://github.com/sponsors/drazenbebic',
  },
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
};
