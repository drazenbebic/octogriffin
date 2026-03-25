import { HowTo, WithContext } from 'schema-dts';

export const settingUpNgrokJsonLd: WithContext<HowTo> = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Setting up Ngrok for Octogriffin',
  description:
    'How to expose your local development environment to GitHub webhooks using Ngrok static domains.',
  url: 'https://octogriffin.com/docs/setting-up-ngrok',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Install Ngrok CLI',
      text: 'Download and install the ngrok command line tool.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Authenticate',
      text: 'Configure your ngrok authtoken.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Locate Static Domain',
      text: 'Find your free static domain in the ngrok dashboard.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Configure Tunnel',
      text: 'Define a persistent tunnel configuration in ngrok.yml.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Start the Tunnel',
      text: 'Launch the tunnel using ngrok start octogriffin.',
    },
    {
      '@type': 'HowToStep',
      position: 6,
      name: 'Update GitHub App',
      text: 'Configure your GitHub App to send webhooks to the ngrok URL.',
    },
  ],
};
