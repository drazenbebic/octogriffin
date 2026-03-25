import { WebPage, WithContext } from 'schema-dts';

import { OCTOGRIFFIN_ORG } from './shared';

export const imprintJsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Imprint - Octogriffin',
  description:
    'Legal disclosure and provider identification for Octogriffin. Operated by Drazen Bebic in Vienna, Austria.',
  url: 'https://octogriffin.com/imprint',
  mainEntity: OCTOGRIFFIN_ORG,
};
