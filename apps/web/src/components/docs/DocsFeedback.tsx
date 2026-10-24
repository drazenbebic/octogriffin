import type { FC } from 'react';

import { GitPullRequestIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';

export const DocsFeedback: FC = () => (
  <div className="mt-12 rounded-2xl bg-accent-soft p-6 flex flex-col sm:flex-row items-center justify-between gap-4 ">
    <div className="flex items-center gap-3 text-text font-medium ">
      <HugeiconsIcon icon={GitPullRequestIcon} size={24} />
      <span>Something went wrong?</span>
    </div>
    <a
      className="text-sm font-bold text-accent-text hover:text-text hover:underline "
      href={githubRepositoryUrl('/issues')}
      rel="noreferrer"
      target="_blank"
    >
      Open an Issue on GitHub &rarr;
    </a>
  </div>
);
