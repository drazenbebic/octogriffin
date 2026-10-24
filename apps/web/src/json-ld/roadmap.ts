import type { WebPage, WithContext } from 'schema-dts';

import { roadmap, statusLabels } from '@/config/roadmap';
import { pageUrl } from '@/seo/pageCatalog';

export const roadmapJsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  description:
    'Our development plan for the future of Octogriffin. See the features currently in the forge and what we’re planning next.',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: roadmap.map((phase, index) => ({
      '@type': 'ListItem',
      description: phase.items.map(item => item.title).join(', '),
      name: `${phase.codename} (${statusLabels[phase.status]})`,
      position: index + 1,
    })),
  },

  name: 'Roadmap - Octogriffin',
  url: pageUrl('/roadmap'),
};
