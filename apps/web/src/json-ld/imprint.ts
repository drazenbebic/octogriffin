import type { WebPage, WithContext } from 'schema-dts';

import { pageUrl } from '@/seo/pageCatalog';

import { OCTOGRIFFIN_ORG } from './shared';

export const imprintJsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  description:
    'Legal disclosure and provider identification for Octogriffin. Operated by Drazen Bebic in Vienna, Austria.',
  mainEntity: OCTOGRIFFIN_ORG,
  name: 'Imprint - Octogriffin',
  url: pageUrl('/imprint'),
};
