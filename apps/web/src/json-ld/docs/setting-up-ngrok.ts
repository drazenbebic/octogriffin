import type { HowTo, WithContext } from 'schema-dts';

import { pageUrl } from '@/seo/pageCatalog';

import { howToSteps } from '../shared';

export const settingUpNgrokJsonLd: WithContext<HowTo> = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  description:
    'How to expose your local development environment to GitHub webhooks using Ngrok static domains.',
  name: 'Setting up Ngrok for Octogriffin',
  step: howToSteps([
    {
      name: 'Install Ngrok CLI',
      text: 'Download and install the ngrok command line tool.',
    },
    {
      name: 'Authenticate',
      text: 'Configure your ngrok authtoken.',
    },
    {
      name: 'Locate Static Domain',
      text: 'Find your free static domain in the ngrok dashboard.',
    },
    {
      name: 'Configure Tunnel',
      text: 'Define a persistent tunnel configuration in ngrok.yml.',
    },
    {
      name: 'Start the Tunnel',
      text: 'Launch the tunnel using ngrok start octogriffin.',
    },
    {
      name: 'Update GitHub App',
      text: 'Configure your GitHub App to send webhooks to the ngrok URL.',
    },
  ]),
  url: pageUrl('/docs/setting-up-ngrok'),
};
