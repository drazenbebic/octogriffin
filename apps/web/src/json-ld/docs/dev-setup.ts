import type { HowTo, WithContext } from 'schema-dts';

import { pageUrl } from '@/seo/pageCatalog';

import { howToSteps } from '../shared';

export const devSetupJsonLd: WithContext<HowTo> = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  description:
    'Complete guide to setting up Octogriffin locally. Learn how to configure Docker, create a GitHub App, and initialize the database for development.',
  name: 'Octogriffin Development Setup',
  step: howToSteps([
    {
      name: 'Expose Localhost',
      text: 'Use a tunnel like Ngrok to make your local environment accessible to GitHub webhooks.',
    },
    {
      name: 'Create GitHub App',
      text: 'Register a new GitHub App with specific repository permissions and event subscriptions.',
    },
    {
      name: 'Fork & Clone',
      text: 'Fork the Octogriffin repository and clone it to your local machine.',
    },
    {
      name: 'Install Dependencies',
      text: 'Run yarn install to install the project dependencies.',
    },
    {
      name: 'Configure Environment',
      text: 'Copy .env.example files and fill in your GitHub and database credentials.',
    },
    {
      name: 'Start Database',
      text: 'Launch the PostgreSQL container using Docker Compose.',
    },
    {
      name: 'Initialize Database',
      text: 'Run Prisma migrations and seed the database with demo data.',
    },
    {
      name: 'Launch Server',
      text: 'Start the development server with yarn dev.',
    },
  ]),
  url: pageUrl('/docs/dev-setup'),
};
