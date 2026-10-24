export type RoadmapStatus = 'exploring' | 'later' | 'next' | 'now' | 'shipped';

export type RoadmapItem = {
  description: string;
  /** The GitHub issue people can vote on. */
  issue?: number;
  status?: 'in-progress' | 'planned';
  title: string;
};

export type RoadmapPhase = {
  codename: string;
  items: RoadmapItem[];
  /** The release tag, e.g. "web-v0.10.0". */
  release?: string;
  /** "YYYY-MM" */
  shippedAt?: string;
  status: RoadmapStatus;
  summary: string;
};

export const statusLabels: Record<RoadmapStatus, string> = {
  exploring: 'exploring',
  later: 'later',
  next: 'next',
  now: 'in progress',
  shipped: 'shipped',
};

/** What's shipped, being built and planned, oldest first. */
export const roadmap: RoadmapPhase[] = [
  {
    codename: 'Foundations',
    items: [
      {
        description: 'Install it on the repositories you choose.',
        title: 'GitHub App',
      },
      {
        description: 'Your Habitica API token is encrypted at rest.',
        title: 'Encrypted tokens',
      },
      {
        description: 'Every GitHub delivery, listed in your dashboard.',
        title: 'Webhook history',
      },
    ],
    release: 'web-v0.4.0',
    shippedAt: '2026-01',
    status: 'shipped',
    summary:
      'The GitHub App, encrypted Habitica tokens, webhook history and the dashboard.',
  },
  {
    codename: 'Control Freak',
    items: [
      {
        description:
          'Map any GitHub event to any Habitica habit, with difficulty, attribute and direction.',
        title: 'Custom triggers',
      },
      {
        description: 'Apply a trigger to some repositories only.',
        title: 'Repository scope',
      },
    ],
    release: 'web-v0.7.0',
    shippedAt: '2026-01',
    status: 'shipped',
    summary:
      'Custom triggers: map any GitHub event to any Habitica habit, with difficulty, attribute, direction and repository scope.',
  },
  {
    codename: 'Dark mode',
    items: [
      {
        description: 'Across the site and the dashboard.',
        title: 'A full dark theme',
      },
    ],
    release: 'web-v0.8.0',
    shippedAt: '2026-03',
    status: 'shipped',
    summary: 'A full dark theme across the site and dashboard.',
  },
  {
    codename: 'Field Guide',
    items: [
      {
        description: 'Ready-made triggers for good coding habits.',
        title: 'Coding habit recipes',
      },
      {
        description: 'Every GitHub event you can earn rewards for.',
        title: 'Event catalogue',
      },
      {
        description: 'Where to find your Habitica User ID and API token.',
        title: 'API token guide',
      },
    ],
    release: 'web-v0.10.0',
    shippedAt: '2026-10',
    status: 'shipped',
    summary:
      'Coding habit recipes, a catalogue of every supported GitHub event, guides to the Habitica API token and App permissions, and stricter token encryption.',
  },
  {
    codename: 'Anti-Cheese',
    items: [
      {
        description:
          'Let a trigger rest for a while after it scores, so a burst of pushes counts once.',
        status: 'in-progress',
        title: 'Per-trigger cooldowns',
      },
      {
        description:
          'Set the most a trigger can score in a Habitica day, to prevent burnout.',
        status: 'in-progress',
        title: 'Daily caps',
      },
      {
        description:
          'Bots like Dependabot and Renovate never earn rewards: their commits are skipped, and their events reward nobody.',
        status: 'in-progress',
        title: 'Ignore bot accounts',
      },
      {
        description:
          'Skip empty commits, and pull requests you close yourself within a minute of opening.',
        status: 'in-progress',
        title: 'Spam detection',
      },
    ],
    status: 'now',
    summary:
      "Rewards should feel earned. This phase makes sure a burst of tiny commits, a bot or a self-merge can't farm Gold.",
  },
  {
    codename: 'Ledger',
    items: [
      {
        description:
          'Every score in the History tab: which trigger fired, what Habitica returned, and any retries.',
        title: 'Reward ledger',
      },
      {
        description:
          'Fire a trigger by hand from the dashboard to check it scores the right habit.',
        title: 'Test a trigger',
      },
      {
        description:
          'An email when Habitica refuses your token, instead of rewards silently stopping.',
        title: 'Token health alerts',
      },
      {
        description:
          'How often each trigger scored in the last 7 and 30 days, right in the list.',
        title: 'Trigger stats',
      },
    ],
    status: 'next',
    summary: "See exactly why you got rewarded, or why you didn't.",
  },
  {
    codename: 'Fine Print',
    items: [
      {
        description:
          'Only count pushes to main, or ignore anything on dependabot/*.',
        title: 'Branch filters',
      },
      {
        description:
          'Reward a closed issue labelled “bug” more than a typo fix.',
        title: 'Label and size filters',
      },
      {
        description:
          'In shared repos, score only events you triggered yourself.',
        title: 'Only my activity',
      },
      {
        description:
          'Save your triggers as JSON and share setups with friends.',
        title: 'Import and export',
      },
    ],
    status: 'next',
    summary: 'Conditions that make one event mean different things.',
  },
  {
    codename: 'Quest Log',
    items: [
      {
        description:
          'An issue assigned to you becomes a To-Do; closing it checks it off.',
        title: 'To-Dos from issues',
      },
      {
        description:
          'Reviewing a pull request on a weekday checks off a Daily.',
        title: 'Dailies',
      },
      {
        description: 'Bonus rewards for contributing several days in a row.',
        title: 'Coding streaks',
      },
      {
        description: 'A small chance of double XP on big wins, like a release.',
        title: 'Critical hits',
      },
    ],
    status: 'later',
    summary: 'Go beyond habits and use the rest of Habitica.',
  },
  {
    codename: 'Beyond GitHub',
    items: [
      {
        description: 'The same triggers, on other forges.',
        title: 'GitLab and Gitea',
      },
      {
        description: 'Score Octogriffin triggers from CI or your own scripts.',
        title: 'Public API',
      },
      {
        description:
          "Merged pull requests in a shared repo damage your party's boss.",
        title: 'Party quests',
      },
      {
        description:
          'Recipe bundles like “Maintainer” or “Reviewer”, added in one go.',
        title: 'Starter packs',
      },
    ],
    status: 'exploring',
    summary: "Ideas we like but haven't committed to.",
  },
];

/** The phase being built right now. */
export const getCurrentPhase = (): RoadmapPhase => {
  const phase = roadmap.find(({ status }) => status === 'now');

  if (!phase) {
    throw new Error('The roadmap needs a phase in progress.');
  }

  return phase;
};
