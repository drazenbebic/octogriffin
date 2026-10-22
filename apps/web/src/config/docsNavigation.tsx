import type { ReactNode } from 'react';

import {
  BookOpen01Icon,
  CodeCircleIcon,
  GitPullRequestIcon,
  Globe02Icon,
  Settings02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export type DocsNavItem = {
  href: string;
  icon?: ReactNode;
  title: string;
};

export type DocsNavSection = {
  items: DocsNavItem[];
  title: string;
};

export const docsNavigation: DocsNavSection[] = [
  {
    items: [
      {
        href: '/docs',
        icon: <HugeiconsIcon icon={BookOpen01Icon} size={18} />,
        title: 'Introduction',
      },
      {
        href: '/docs/dev-setup',
        icon: <HugeiconsIcon icon={Settings02Icon} size={18} />,
        title: 'Development Setup',
      },
      {
        href: '/docs/setting-up-ngrok',
        icon: <HugeiconsIcon icon={Globe02Icon} size={18} />,
        title: 'Setting up ngrok',
      },
    ],
    title: 'Getting Started',
  },
  {
    items: [
      {
        href: '/docs/how-to-contribute',
        icon: <HugeiconsIcon icon={GitPullRequestIcon} size={18} />,
        title: 'How to Contribute',
      },
      {
        href: '/docs/architecture',
        icon: <HugeiconsIcon icon={CodeCircleIcon} size={18} />,
        title: 'Architecture',
      },
    ],
    title: 'Contribution',
  },
];
