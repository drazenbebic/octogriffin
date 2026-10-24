import type { Metadata } from 'next';

import { DocsFeedback } from '@/components/docs/DocsFeedback';
import { Link } from '@/components/Link';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { recipes } from '@/config/recipes';
import { pageMetadata } from '@/seo/pageCatalog';

export const metadata: Metadata = pageMetadata('/docs/coding-habits');

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
          can add to your <Link href="/dashboard">dashboard</Link> in one click
          to reward the coding habits you want to keep.
        </Content>
      </div>

      <section className="flex flex-col gap-5">
        <Heading level={2}>Recipes</Heading>
        <div className="grid gap-4 sm:grid-cols-2">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Heading level={2} size="h3">
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
