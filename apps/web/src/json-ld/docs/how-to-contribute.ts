import { HowTo, WithContext } from 'schema-dts';

export const howToContributeJsonLd: WithContext<HowTo> = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Contribute to Octogriffin',
  description:
    'Guidelines for contributing to Octogriffin. Learn about our branching strategy, commit conventions, and pull request process.',
  url: 'https://octogriffin.com/docs/how-to-contribute',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Find a Task',
      text: 'Check GitHub Milestones or look for "good first issue" labels.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Fork the Repository',
      text: 'Create your own copy of the repository and clone it locally.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Branching Strategy',
      text: 'Create a feature or fix branch from main.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Conventional Commits',
      text: 'Use the Conventional Commits specification for all commit messages.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Development Standards',
      text: 'Follow UI component standards and icon usage guidelines.',
    },
    {
      '@type': 'HowToStep',
      position: 6,
      name: 'Open a Pull Request',
      text: 'Submit your changes for review and ensure all builds pass.',
    },
  ],
};
