import { useMemo } from 'react';
import { FC } from 'react';

import {
  AlertCircleIcon,
  BookOpen01Icon,
  CodeFolderIcon,
  Comment01Icon,
  Flag01Icon,
  GitBranchIcon,
  GitCommitIcon,
  GitForkIcon,
  GitPullRequestIcon,
  HugeiconsProps,
  PackageIcon,
  PlayCircleIcon,
  Rocket01Icon,
  StarIcon,
  Tag01Icon,
  ZapIcon,
} from 'hugeicons-react';

const EVENT_ICONS: Record<string, FC<HugeiconsProps>> = {
  push: GitCommitIcon,
  create: GitBranchIcon,
  delete: GitBranchIcon,
  pull_request: GitPullRequestIcon,
  discussion: Comment01Icon,
  fork: GitForkIcon,
  gollum: BookOpen01Icon,
  issue: AlertCircleIcon,
  label: Tag01Icon,
  milestone: Flag01Icon,
  package: PackageIcon,
  release: Rocket01Icon,
  repository: CodeFolderIcon,
  star: StarIcon,
  workflow: PlayCircleIcon,
};

export const useEventIcon = (event: string, props?: HugeiconsProps) => {
  return useMemo(() => {
    let IconComponent = ZapIcon; // Default

    if (EVENT_ICONS[event]) {
      IconComponent = EVENT_ICONS[event];
    } else {
      const match = Object.keys(EVENT_ICONS).find(key => event.startsWith(key));
      if (match) {
        IconComponent = EVENT_ICONS[match];
      }
    }

    return <IconComponent {...props} />;
  }, [event, props]);
};
