import { HowTo, WithContext } from 'schema-dts';

export const installationJsonLd: WithContext<HowTo> = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to install Octogriffin',
  description:
    'Follow our step-by-step guide to install the GitHub App, configure permissions, and link your Habitica account.',
  url: 'https://octogriffin.com/installation',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Install the App',
      text: 'Install the GitHub App on your account to grant permission to listen to your commits securely.',
      url: 'https://github.com/apps/octogriffin',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Select Repositories',
      text: 'Choose All Repositories or select specific projects you want to gamify.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Enter Credentials',
      text: 'Enter your Habitica User ID and API Token in the Octogriffin dashboard.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Set Triggers',
      text: 'Map GitHub events to rewards to start earning Gold and XP.',
    },
  ],
};
