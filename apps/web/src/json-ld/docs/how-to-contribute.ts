import type { HowTo, WithContext } from 'schema-dts';

import { pageUrl } from '@/seo/pageCatalog';

export const howToContributeJsonLd: WithContext<HowTo> = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  description:
    'Guidelines for contributing to Octogriffin. Learn about our branching strategy, commit conventions, and pull request process.',
  name: 'How to Contribute to Octogriffin',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Find a Task',
      position: 1,
      text: 'Check GitHub Milestones or look for "good first issue" labels.',
    },
    {
      '@type': 'HowToStep',
      name: 'Fork the Repository',
      position: 2,
      text: 'Create your own copy of the repository and clone it locally.',
    },
    {
      '@type': 'HowToStep',
      name: 'Branching Strategy',
      position: 3,
      text: 'Create a feature or fix branch from main.',
    },
    {
      '@type': 'HowToStep',
      name: 'Conventional Commits',
      position: 4,
      text: 'Use the Conventional Commits specification for all commit messages.',
    },
    {
      '@type': 'HowToStep',
      name: 'Development Standards',
      position: 5,
      text: 'Follow UI component standards and icon usage guidelines.',
    },
    {
      '@type': 'HowToStep',
      name: 'Open a Pull Request',
      position: 6,
      text: 'Submit your changes for review and ensure all builds pass.',
    },
  ],
  url: pageUrl('/docs/how-to-contribute'),
};
