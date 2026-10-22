import type { TechArticle, WithContext } from 'schema-dts';

import { pageUrl } from '@/seo/pageCatalog';

export const architectureJsonLd: WithContext<TechArticle> = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  author: {
    '@type': 'Person',
    name: 'Drazen Bebic',
    url: 'https://bebic.dev',
  },
  dependencies: 'Next.js, Vercel, Neon, Prisma, GitHub Apps API, Habitica API',
  description:
    'High-level overview of the Octogriffin technology stack, data flow, and security model.',
  headline: 'Octogriffin Technical Architecture and Data Flow',
  name: 'Octogriffin Architecture',
  proficiencyLevel: 'Intermediate',
  publisher: {
    '@type': 'Organization',
    name: 'Octogriffin',
  },
  url: pageUrl('/docs/architecture'),
};
