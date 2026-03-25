import { FAQPage, WithContext } from 'schema-dts';

export const faqJsonLd: WithContext<FAQPage> = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is this free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, 100%. Octogriffin is a passion project and intended to keep free forever.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I install Octogriffin?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Install our GitHub App on your repositories, then log in to the Dashboard and enter your Habitica User ID and API Token.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my Habitica API Token secure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Your API credentials are encrypted at rest in our database using industry-standard encryption (AES-256).',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Octogriffin have access to my source code?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. We strictly request the minimum permissions required and do not request access to your code contents.',
      },
    },
  ],
};
