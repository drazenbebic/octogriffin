import { WebPage, WithContext } from 'schema-dts';

import { OCTOGRIFFIN_ORG } from '../shared';

export const docsIndexJsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Octogriffin Documentation',
  description:
    'The complete guide to Octogriffin. Explore documentation for installation, configuration, architecture, and contributing to the open-source codebase.',
  url: 'https://octogriffin.com/docs',
  publisher: OCTOGRIFFIN_ORG,
};
