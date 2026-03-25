import { useMemo } from 'react';

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
  PackageIcon,
  PlayCircleIcon,
  Rocket01Icon,
  StarIcon,
  Tag01Icon,
  ZapIcon,
} from '@hugeicons/core-free-icons';
import {
  HugeiconsIcon,
  HugeiconsIconProps,
  IconSvgElement,
} from '@hugeicons/react';

const EVENT_ICONS: Record<string, IconSvgElement> = {
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

export const useEventIcon = (
  event: string,
  props?: Partial<HugeiconsIconProps>,
) => {
  return useMemo(() => {
    let icon = ZapIcon; // Default

    if (EVENT_ICONS[event]) {
      icon = EVENT_ICONS[event];
    } else {
      const match = Object.keys(EVENT_ICONS).find(key => event.startsWith(key));

      if (match) {
        icon = EVENT_ICONS[match];
      }
    }

    return <HugeiconsIcon icon={icon} {...props} />;
  }, [event, props]);
};
