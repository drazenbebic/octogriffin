import { HowTo, WithContext } from 'schema-dts';

export const devSetupJsonLd: WithContext<HowTo> = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Octogriffin Development Setup',
  description:
    'Complete guide to setting up Octogriffin locally. Learn how to configure Docker, create a GitHub App, and initialize the database for development.',
  url: 'https://octogriffin.com/docs/dev-setup',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Expose Localhost',
      text: 'Use a tunnel like Ngrok to make your local environment accessible to GitHub webhooks.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Create GitHub App',
      text: 'Register a new GitHub App with specific repository permissions and event subscriptions.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Fork & Clone',
      text: 'Fork the Octogriffin repository and clone it to your local machine.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Install Dependencies',
      text: 'Run yarn install to install the project dependencies.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Configure Environment',
      text: 'Copy .env.example files and fill in your GitHub and database credentials.',
    },
    {
      '@type': 'HowToStep',
      position: 6,
      name: 'Start Database',
      text: 'Launch the PostgreSQL container using Docker Compose.',
    },
    {
      '@type': 'HowToStep',
      position: 7,
      name: 'Initialize Database',
      text: 'Run Prisma migrations and seed the database with demo data.',
    },
    {
      '@type': 'HowToStep',
      position: 8,
      name: 'Launch Server',
      text: 'Start the development server with yarn dev.',
    },
  ],
};
