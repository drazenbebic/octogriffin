import type { HowTo, WithContext } from 'schema-dts';

import { pageUrl } from '@/seo/pageCatalog';

import { howToSteps } from './shared';

export const installationJsonLd: WithContext<HowTo> = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  description:
    'Follow our step-by-step guide to install the GitHub App, configure permissions, and link your Habitica account.',
  name: 'How to connect GitHub to Habitica',
  step: howToSteps([
    {
      name: 'Install the App',
      text: 'Install the GitHub App on your account to grant permission to listen to your commits securely.',
      url: 'https://github.com/apps/octogriffin',
    },
    {
      name: 'Select Repositories',
      text: 'Choose All Repositories or select specific projects you want to gamify.',
    },
    {
      name: 'Enter Credentials',
      text: 'Enter your Habitica User ID and API Token in the Octogriffin dashboard.',
    },
    {
      name: 'Set Triggers',
      text: 'Map GitHub events to rewards to start earning Gold and XP.',
    },
  ]),
  url: pageUrl('/installation'),
};
