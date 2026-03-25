import { WebPage, WithContext } from 'schema-dts';

export const roadmapJsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Roadmap - Octogriffin',
  description:
    'Our development plan for the future of Octogriffin. See the features currently in the forge and our master plan for the ultimate RPG workflow tool.',
  url: 'https://octogriffin.com/roadmap',
  mainEntity: {
    '@type': 'ItemList',
    name: 'Octogriffin Development Roadmap',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Phase 1: Control Freak (Completed)',
        description: 'Advanced Event Triggers and Granular Scoping.',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Phase 2: Anti-Cheese (Next Up)',
        description: 'Daily XP Caps and Smart Spam Detection.',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Phase 3: Gamification (Future Concepts)',
        description:
          "Coding Streaks, 'Critical Hit' Bonuses, and The Activity Ledger.",
      },
    ],
  },
};
