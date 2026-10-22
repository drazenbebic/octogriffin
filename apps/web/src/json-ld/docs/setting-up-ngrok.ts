import type { HowTo, WithContext } from 'schema-dts';

export const settingUpNgrokJsonLd: WithContext<HowTo> = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  description:
    'How to expose your local development environment to GitHub webhooks using Ngrok static domains.',
  name: 'Setting up Ngrok for Octogriffin',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Install Ngrok CLI',
      position: 1,
      text: 'Download and install the ngrok command line tool.',
    },
    {
      '@type': 'HowToStep',
      name: 'Authenticate',
      position: 2,
      text: 'Configure your ngrok authtoken.',
    },
    {
      '@type': 'HowToStep',
      name: 'Locate Static Domain',
      position: 3,
      text: 'Find your free static domain in the ngrok dashboard.',
    },
    {
      '@type': 'HowToStep',
      name: 'Configure Tunnel',
      position: 4,
      text: 'Define a persistent tunnel configuration in ngrok.yml.',
    },
    {
      '@type': 'HowToStep',
      name: 'Start the Tunnel',
      position: 5,
      text: 'Launch the tunnel using ngrok start octogriffin.',
    },
    {
      '@type': 'HowToStep',
      name: 'Update GitHub App',
      position: 6,
      text: 'Configure your GitHub App to send webhooks to the ngrok URL.',
    },
  ],
  url: 'https://octogriffin.com/docs/setting-up-ngrok',
};
