import { TechArticle, WithContext } from 'schema-dts';

export const architectureJsonLd: WithContext<TechArticle> = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  name: 'Octogriffin Architecture',
  headline: 'Octogriffin Technical Architecture and Data Flow',
  description:
    'High-level overview of the Octogriffin technology stack, data flow, and security model.',
  url: 'https://octogriffin.com/docs/architecture',
  author: {
    '@type': 'Person',
    name: 'Drazen Bebic',
    url: 'https://bebic.dev',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Octogriffin',
  },
  dependencies: 'Next.js, Vercel, Neon, Prisma, GitHub Apps API, Habitica API',
  proficiencyLevel: 'Intermediate',
};
