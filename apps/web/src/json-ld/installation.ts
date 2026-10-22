import type { HowTo, WithContext } from 'schema-dts';

export const installationJsonLd: WithContext<HowTo> = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  description:
    'Follow our step-by-step guide to install the GitHub App, configure permissions, and link your Habitica account.',
  name: 'How to install Octogriffin',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Install the App',
      position: 1,
      text: 'Install the GitHub App on your account to grant permission to listen to your commits securely.',
      url: 'https://github.com/apps/octogriffin',
    },
    {
      '@type': 'HowToStep',
      name: 'Select Repositories',
      position: 2,
      text: 'Choose All Repositories or select specific projects you want to gamify.',
    },
    {
      '@type': 'HowToStep',
      name: 'Enter Credentials',
      position: 3,
      text: 'Enter your Habitica User ID and API Token in the Octogriffin dashboard.',
    },
    {
      '@type': 'HowToStep',
      name: 'Set Triggers',
      position: 4,
      text: 'Map GitHub events to rewards to start earning Gold and XP.',
    },
  ],
  url: 'https://octogriffin.com/installation',
};
