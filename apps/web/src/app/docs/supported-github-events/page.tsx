import type { Metadata } from 'next';

import { DocsFeedback } from '@/components/docs/DocsFeedback';
import { EventCatalogue } from '@/components/docs/EventCatalogue';
import { Link } from '@/components/Link';
import { Alert } from '@/components/ui/Alert';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { pageMetadata } from '@/seo/pageCatalog';
import { getGroupedGithubEvents } from '@/utils/githubEvents';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';

export const metadata: Metadata = pageMetadata('/docs/supported-github-events');

export default function DocsSupportedGithubEventsPage() {
  const events = getGroupedGithubEvents();

  return (
    <div className="flex max-w-[860px] flex-col gap-12 pb-20">
      <div>
        <Heading className="mb-4" level={1}>
          Supported GitHub events
        </Heading>
        <Content size="lg">
          Octogriffin can turn {events.length} different GitHub events into
          Habitica rewards. Pick any of them when you create a trigger in your{' '}
          <Link href="/dashboard">dashboard</Link>, and Octogriffin scores the
          matching Habitica habit each time the event happens.
        </Content>
      </div>

      <section className="space-y-4">
        <Heading level={2}>How events are counted</Heading>
        <ul className="list-disc space-y-2 pl-5">
          <Content as="li">
            <strong>Pushes</strong> score once for every commit you wrote in
            that push. Commits by bots are skipped, and a single push scores at
            most 10 times. A trigger with a cooldown skips every push until its
            cooldown has passed. A daily cap stops a trigger once it has scored
            that many times in your Habitica day.
          </Content>
          <Content as="li">
            <strong>Every other event</strong> scores once, when you are the
            person who caused it, for example the one who opened the pull
            request or submitted the review.
          </Content>
          <Content as="li">
            Events only count in the repositories you picked for that trigger.
          </Content>
        </ul>
        <Alert title="Events can't tell success from failure" variant="info">
          Some events fire in more than one situation. &quot;Pull Request
          Closed&quot; fires for merged and unmerged pull requests alike, and
          &quot;Workflow Run Completed&quot; fires whether the run passed or
          failed. Keep that in mind before using them to take away health.
        </Alert>
      </section>

      <section className="flex flex-col gap-5">
        <Heading level={2}>All events</Heading>
        <EventCatalogue events={events} />
      </section>

      <Content>
        Missing an event you would like to be rewarded for?{' '}
        <Link href="/roadmap">Check the roadmap</Link> or{' '}
        <Link href={githubRepositoryUrl('/issues')} target="_blank">
          suggest it on GitHub
        </Link>
        .
      </Content>

      <DocsFeedback />
    </div>
  );
}
