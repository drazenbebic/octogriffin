import type { WebPage, WithContext } from 'schema-dts';

import { pageUrl } from '@/seo/pageCatalog';

import { OCTOGRIFFIN_ORG } from '../shared';

export const docsIndexJsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  description:
    'The complete guide to Octogriffin. Explore documentation for installation, configuration, architecture, and contributing to the open-source codebase.',
  name: 'Octogriffin Documentation',
  publisher: OCTOGRIFFIN_ORG,
  url: pageUrl('/docs'),
};
