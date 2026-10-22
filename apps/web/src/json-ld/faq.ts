import type { FAQPage, WithContext } from 'schema-dts';

export const faqJsonLd: WithContext<FAQPage> = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, 100%. Octogriffin is a passion project and intended to keep free forever.',
      },
      name: 'Is this free to use?',
    },
    {
      '@type': 'Question',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Install our GitHub App on your repositories, then log in to the Dashboard and enter your Habitica User ID and API Token.',
      },
      name: 'How do I install Octogriffin?',
    },
    {
      '@type': 'Question',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Your API credentials are encrypted at rest in our database using industry-standard encryption (AES-256).',
      },
      name: 'Is my Habitica API Token secure?',
    },
    {
      '@type': 'Question',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. We strictly request the minimum permissions required and do not request access to your code contents.',
      },
      name: 'Does Octogriffin have access to my source code?',
    },
  ],
};
