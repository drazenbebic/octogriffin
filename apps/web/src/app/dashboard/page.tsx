import type { Metadata } from 'next';

import { generatePageMetadata } from '@/utils/seo';

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePageMetadata({
    description:
      'Configure automated rewards for your GitHub activity. Define how much XP and Gold you earn for commits, pull requests, and code reviews.',
    path: 'dashboard',
    suffix: 'Octogriffin Dashboard',
    title: 'Triggers',
  });
};

export default function DashboardPage() {
  return null;
}
