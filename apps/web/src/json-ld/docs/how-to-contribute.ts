import type { HowTo, WithContext } from 'schema-dts';

import { pageUrl } from '@/seo/pageCatalog';

import { howToSteps } from '../shared';

export const howToContributeJsonLd: WithContext<HowTo> = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  description:
    'Guidelines for contributing to Octogriffin. Learn about our branching strategy, commit conventions, and pull request process.',
  name: 'How to Contribute to Octogriffin',
  step: howToSteps([
    {
      name: 'Find a Task',
      text: 'Check GitHub Milestones or look for "good first issue" labels.',
    },
    {
      name: 'Fork the Repository',
      text: 'Create your own copy of the repository and clone it locally.',
    },
    {
      name: 'Branching Strategy',
      text: 'Create a feature or fix branch from main.',
    },
    {
      name: 'Conventional Commits',
      text: 'Use the Conventional Commits specification for all commit messages.',
    },
    {
      name: 'Development Standards',
      text: 'Follow the Development Standards: checks, code style, project structure, the design system and testing.',
    },
    {
      name: 'Open a Pull Request',
      text: 'Submit your changes for review and ensure all builds pass.',
    },
  ]),
  url: pageUrl('/docs/how-to-contribute'),
};
