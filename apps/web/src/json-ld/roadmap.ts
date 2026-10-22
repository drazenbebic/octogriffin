import type { WebPage, WithContext } from 'schema-dts';

import { pageUrl } from '@/seo/pageCatalog';

export const roadmapJsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  description:
    'Our development plan for the future of Octogriffin. See the features currently in the forge and our master plan for the ultimate RPG workflow tool.',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'ListItem',
        description: 'Advanced Event Triggers and Granular Scoping.',
        name: 'Phase 1: Control Freak (Completed)',
        position: 1,
      },
      {
        '@type': 'ListItem',
        description: 'Daily XP Caps and Smart Spam Detection.',
        name: 'Phase 2: Anti-Cheese (Next Up)',
        position: 2,
      },
      {
        '@type': 'ListItem',
        description:
          "Coding Streaks, 'Critical Hit' Bonuses, and The Activity Ledger.",
        name: 'Phase 3: Gamification (Future Concepts)',
        position: 3,
      },
    ],
    name: 'Octogriffin Development Roadmap',
  },
  name: 'Roadmap - Octogriffin',
  url: pageUrl('/roadmap'),
};
