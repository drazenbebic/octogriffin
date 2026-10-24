import {
  CheckmarkCircle02Icon,
  GitCommitIcon,
  GitPullRequestIcon,
  PackageIcon,
  ViewIcon,
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';

import type { HabiticaAttribute } from '@/components/ui/AttributeChip';

export type RecipePreset = {
  event: string;
  scoreDirection: 'down' | 'up';
  taskAttribute: HabiticaAttribute;
  taskFrequency: 'daily' | 'monthly' | 'weekly';
  taskNote?: string;
  taskPriority: number;
  taskTitle: string;
};

export type Recipe = {
  icon: IconSvgElement;
  preset: RecipePreset;
  slug: string;
  /** What to do next, shown after the recipe is added: "Open a pull request in …". */
  successHint: string;
  summary: string;
  title: string;
};

/** Ready-made triggers for coding habits worth keeping. */
export const recipes: Recipe[] = [
  {
    icon: GitCommitIcon,
    preset: {
      event: 'push',
      scoreDirection: 'up',
      taskAttribute: 'str',
      taskFrequency: 'daily',
      taskPriority: 0.1,
      taskTitle: 'Pushed code',
    },
    slug: 'code-every-day',
    successHint: 'Push a commit',
    summary:
      'Scores once per commit you push, so a small reward keeps big pushes from flooding your character with Gold.',
    title: 'Code a little every day',
  },
  {
    icon: GitPullRequestIcon,
    preset: {
      event: 'pull_request.opened',
      scoreDirection: 'up',
      taskAttribute: 'str',
      taskFrequency: 'weekly',
      taskPriority: 1,
      taskTitle: 'Opened a pull request',
    },
    slug: 'ship-pull-requests',
    successHint: 'Open a pull request',
    summary:
      'Rewards finishing work and putting it up for review, not just typing.',
    title: 'Ship pull requests',
  },
  {
    icon: ViewIcon,
    preset: {
      event: 'pull_request_review.submitted',
      scoreDirection: 'up',
      taskAttribute: 'int',
      taskFrequency: 'weekly',
      taskPriority: 1.5,
      taskTitle: 'Reviewed a pull request',
    },
    slug: 'review-code',
    successHint: 'Review a pull request',
    summary:
      'Code reviews are easy to put off. A bigger reward makes them worth picking up.',
    title: "Review your teammates' code",
  },
  {
    icon: CheckmarkCircle02Icon,
    preset: {
      event: 'issues.closed',
      scoreDirection: 'up',
      taskAttribute: 'con',
      taskFrequency: 'weekly',
      taskPriority: 1,
      taskTitle: 'Closed an issue',
    },
    slug: 'close-issues',
    successHint: 'Close an issue',
    summary: 'Keeps your backlog shrinking instead of only growing.',
    title: 'Close out issues',
  },
  {
    icon: PackageIcon,
    preset: {
      event: 'release.published',
      scoreDirection: 'up',
      taskAttribute: 'per',
      taskFrequency: 'monthly',
      taskPriority: 2,
      taskTitle: 'Published a release',
    },
    slug: 'ship-a-release',
    successHint: 'Publish a release',
    summary: 'Releases are rare and hard-won, so they get the biggest reward.',
    title: 'Ship a release',
  },
];
