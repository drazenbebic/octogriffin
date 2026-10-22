import type { HowTo, WithContext } from 'schema-dts';

import { pageUrl } from '@/seo/pageCatalog';

export const devSetupJsonLd: WithContext<HowTo> = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  description:
    'Complete guide to setting up Octogriffin locally. Learn how to configure Docker, create a GitHub App, and initialize the database for development.',
  name: 'Octogriffin Development Setup',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Expose Localhost',
      position: 1,
      text: 'Use a tunnel like Ngrok to make your local environment accessible to GitHub webhooks.',
    },
    {
      '@type': 'HowToStep',
      name: 'Create GitHub App',
      position: 2,
      text: 'Register a new GitHub App with specific repository permissions and event subscriptions.',
    },
    {
      '@type': 'HowToStep',
      name: 'Fork & Clone',
      position: 3,
      text: 'Fork the Octogriffin repository and clone it to your local machine.',
    },
    {
      '@type': 'HowToStep',
      name: 'Install Dependencies',
      position: 4,
      text: 'Run yarn install to install the project dependencies.',
    },
    {
      '@type': 'HowToStep',
      name: 'Configure Environment',
      position: 5,
      text: 'Copy .env.example files and fill in your GitHub and database credentials.',
    },
    {
      '@type': 'HowToStep',
      name: 'Start Database',
      position: 6,
      text: 'Launch the PostgreSQL container using Docker Compose.',
    },
    {
      '@type': 'HowToStep',
      name: 'Initialize Database',
      position: 7,
      text: 'Run Prisma migrations and seed the database with demo data.',
    },
    {
      '@type': 'HowToStep',
      name: 'Launch Server',
      position: 8,
      text: 'Start the development server with yarn dev.',
    },
  ],
  url: pageUrl('/docs/dev-setup'),
};
