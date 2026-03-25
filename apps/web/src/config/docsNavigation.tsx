import { ReactNode } from 'react';

import {
  BookOpen01Icon,
  CodeCircleIcon,
  GitPullRequestIcon,
  Globe02Icon,
  Settings02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export type DocsNavItem = {
  title: string;
  href: string;
  icon?: ReactNode;
};

export type DocsNavSection = {
  title: string;
  items: DocsNavItem[];
};

export const docsNavigation: DocsNavSection[] = [
  {
    title: 'Getting Started',
    items: [
      {
        title: 'Introduction',
        href: '/docs',
        icon: <HugeiconsIcon icon={BookOpen01Icon} size={18} />,
      },
      {
        title: 'Development Setup',
        href: '/docs/dev-setup',
        icon: <HugeiconsIcon icon={Settings02Icon} size={18} />,
      },
      {
        title: 'Setting up ngrok',
        href: '/docs/setting-up-ngrok',
        icon: <HugeiconsIcon icon={Globe02Icon} size={18} />,
      },
    ],
  },
  {
    title: 'Contribution',
    items: [
      {
        title: 'How to Contribute',
        href: '/docs/how-to-contribute',
        icon: <HugeiconsIcon icon={GitPullRequestIcon} size={18} />,
      },
      {
        title: 'Architecture',
        href: '/docs/architecture',
        icon: <HugeiconsIcon icon={CodeCircleIcon} size={18} />,
      },
    ],
  },
];
