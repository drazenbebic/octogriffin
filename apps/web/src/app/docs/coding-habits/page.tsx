import type { Metadata } from 'next';

import { DocsFeedback } from '@/components/docs/DocsFeedback';
import { Link } from '@/components/Link';
import { Card } from '@/components/ui/Card';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { pageMetadata } from '@/seo/pageCatalog';

export const metadata: Metadata = pageMetadata('/docs/coding-habits');

type Recipe = {
  attribute: string;
  difficulty: string;
  event: string;
  resetCounter: string;
  summary: string;
  taskTitle: string;
  title: string;
};

const recipes: Recipe[] = [
  {
    attribute: 'STR',
    difficulty: 'Trivial',
    event: 'Push to Repository',
    resetCounter: 'Daily',
    summary:
      'Scores once per commit you push, so a small reward keeps big pushes from flooding your character with Gold.',
    taskTitle: 'Pushed code',
    title: 'Code a little every day',
  },
  {
    attribute: 'STR',
    difficulty: 'Easy',
    event: 'Pull Request Opened',
    resetCounter: 'Weekly',
    summary:
      'Rewards finishing work and putting it up for review, not just typing.',
    taskTitle: 'Opened a pull request',
    title: 'Ship pull requests',
  },
  {
    attribute: 'INT',
    difficulty: 'Medium',
    event: 'Pull Request Review Submitted',
    resetCounter: 'Weekly',
    summary:
      'Code reviews are easy to put off. A bigger reward makes them worth picking up.',
    taskTitle: 'Reviewed a pull request',
    title: "Review your teammates' code",
  },
  {
    attribute: 'CON',
    difficulty: 'Easy',
    event: 'Issues Closed',
    resetCounter: 'Weekly',
    summary: 'Keeps your backlog shrinking instead of only growing.',
    taskTitle: 'Closed an issue',
    title: 'Close out issues',
  },
  {
    attribute: 'PER',
    difficulty: 'Hard',
    event: 'Release Published',
    resetCounter: 'Monthly',
    summary: 'Releases are rare and hard-won, so they get the biggest reward.',
    taskTitle: 'Published a release',
    title: 'Ship a release',
  },
];

export default function DocsCodingHabitsPage() {
  return (
    <div className="max-w-3xl space-y-12 pb-20">
      <div>
        <Heading className="mb-4" level={1}>
          Build coding habits in Habitica with GitHub
        </Heading>
        <Content size="lg">
          Every Octogriffin trigger is a Habitica habit that gets scored when
          something happens on GitHub. These recipes are ready-made triggers you
          can copy into your <Link href="/dashboard">dashboard</Link> to reward
          the coding habits you want to keep.
        </Content>
      </div>

      <section className="space-y-6">
        <Heading level={2} size="xl">
          Recipes
        </Heading>
        <div className="grid gap-4">
          {recipes.map(recipe => (
            <Card className="p-5" key={recipe.title} variant="outlined">
              <Heading className="mb-1" level={3} size="base">
                {recipe.title}
              </Heading>
              <Content className="mb-4" size="sm">
                {recipe.summary}
              </Content>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                {[
                  ['Event', recipe.event],
                  ['Task Title', recipe.taskTitle],
                  ['Difficulty', recipe.difficulty],
                  ['Attribute', recipe.attribute],
                  ['Action', 'Reward (XP/Gold)'],
                  ['Reset Counter', recipe.resetCounter],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {label}
                    </dt>
                    <dd className="text-slate-900 dark:text-slate-100">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Heading level={2} size="xl">
          Tips
        </Heading>
        <ul className="list-disc space-y-3 pl-5">
          <Content as="li">
            <strong>Reuse a habit you already have.</strong> Octogriffin looks
            for a Habitica task with exactly the same title before creating a
            new one. For a perfect match, set the <strong>Task Alias</strong>{' '}
            under Advanced Settings.
          </Content>
          <Content as="li">
            <strong>Difficulty sets the size of the reward.</strong> Harder
            habits give more XP and Gold per score, so save Medium and Hard for
            things that don&apos;t happen often.
          </Content>
          <Content as="li">
            <strong>Reset Counter</strong> decides whether Habitica counts the
            habit per day, week or month.
          </Content>
          <Content as="li">
            <strong>Split work and side projects.</strong> Create two triggers
            for the same event with different repositories and task titles to
            see each one as its own habit.
          </Content>
          <Content as="li">
            <strong>Use &quot;Punish&quot; carefully.</strong> Some events fire
            for good and bad outcomes alike, for example a workflow run that
            passed or failed. Check the{' '}
            <Link href="/docs/supported-github-events">
              supported GitHub events
            </Link>{' '}
            before taking away health.
          </Content>
        </ul>
      </section>

      <DocsFeedback />
    </div>
  );
}
