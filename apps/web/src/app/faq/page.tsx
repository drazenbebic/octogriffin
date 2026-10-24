import type { Metadata } from 'next';
import NextLink from 'next/link';
import type { ReactNode } from 'react';

import { Mail01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { JsonLd } from '@/components/JsonLd';
import { Link } from '@/components/Link';
import { PageHeader } from '@/components/PageHeader';
import { Accordion } from '@/components/ui/Accordion';
import { AccordionGroup } from '@/components/ui/AccordionGroup';
import { Button } from '@/components/ui/Button';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { Shell } from '@/components/ui/Shell';
import { getCurrentPhase } from '@/config/roadmap';
import { faqJsonLd } from '@/json-ld/faq';
import { pageMetadata } from '@/seo/pageCatalog';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';
import { supportEmail } from '@/utils/supportEmail';

type FAQ = {
  answer: ReactNode;
  question: string;
};

export const metadata: Metadata = pageMetadata('/faq');

const setup: FAQ[] = [
  {
    answer: (
      <>
        <Content className="mb-4">
          <strong>Yes, 100%.</strong> Octogriffin is a passion project and I
          intend to keep it free forever. However, servers aren&#39;t free and
          coffee is essential fuel. If you&#39;d like to support development and
          help cover hosting costs, you can sponsor me on{' '}
          <Link href="https://github.com/sponsors/drazenbebic" target="_blank">
            GitHub Sponsors
          </Link>{' '}
          or buy me a coffee on{' '}
          <Link href="https://ko-fi.com/drazen" target="_blank">
            Ko-fi
          </Link>
          .
        </Content>
        <Content>
          Sponsorships start as low as <strong>$2/month</strong>. At{' '}
          <strong>$5/month</strong>, you&#39;ll be listed in our project README,
          and at <strong>$15/month</strong>, you get a dedicated mention on this
          website plus <strong>priority status</strong> for your feature
          requests!
        </Content>
        <Content>
          Check out the <Link href="/sponsors">Sponsors</Link> page for more
          information!
        </Content>
      </>
    ),
    question: 'Is this free to use?',
  },
  {
    answer: (
      <>
        <Content className="mb-4">
          It is a simple two-step process. First, install our GitHub App on the
          repositories you want to track. Second, log in to the{' '}
          <Link href="/dashboard/settings">Dashboard</Link> and enter your
          Habitica User ID and API Token.{' '}
          <Link href="/docs/habitica-api-token">
            Here is where Habitica keeps them
          </Link>
          .
        </Content>
        <Content>
          You&#39;re now ready to configure your triggers and start earning
          Gold/XP!
        </Content>
      </>
    ),
    question: 'How do I install Octogriffin?',
  },
  {
    answer: (
      <Content>
        Once linked, head to the <Link href="/dashboard">Dashboard</Link> to
        create <strong>Triggers</strong>. You decide the rules:{' '}
        <em>
          &#34;When I [Push Code] to [This Repo], score a [Medium] task&#34;
        </em>
        . You can create as many triggers as you want for different events and
        repositories. For ready-made examples, see the{' '}
        <Link href="/docs/coding-habits">coding habit recipes</Link>.
      </Content>
    ),
    question: 'How do I configure my rewards?',
  },
  {
    answer: (
      <Content>
        Absolutely. Since Octogriffin works as a GitHub App, you explicitly
        grant it access to specific repositories - whether they are public or
        private. We process the webhooks securely regardless of visibility.
      </Content>
    ),
    question: 'Does this work with private repositories?',
  },
  {
    answer: (
      <>
        <Content className="mb-4">
          We use GitHub Webhooks to listen for activity on your connected
          repositories. When you push code, open a pull request, or close an
          issue, GitHub notifies our servers.
        </Content>
        <Content>
          We then analyze the event metadata (like commit size or issue
          complexity) to calculate a fair XP reward. Finally, we use the
          Habitica API to score a custom task on your account, instantly
          granting you Gold and Experience.
        </Content>
      </>
    ),
    question: 'How exactly does the syncing work?',
  },
];

const dataPrivacy: FAQ[] = [
  {
    answer: (
      <Content>
        Your API credentials are <strong>encrypted at rest</strong> in our
        database using industry-standard encryption (AES-256). We never expose
        them in the frontend, and they are only decrypted momentarily by our
        server to send requests to Habitica on your behalf.
      </Content>
    ),
    question: 'Is my Habitica API Token secure?',
  },
  {
    answer: (
      <Content>
        <strong>Read-only, and we never use it.</strong> GitHub only sends push
        events to apps that can read a repository&apos;s contents, so the
        Octogriffin GitHub App asks for read-only <strong>Contents</strong>{' '}
        access. It can never change your code. Octogriffin never downloads your
        files: it only uses the event details GitHub sends, like who pushed and
        how many commits, and stores a record of which events earned you
        rewards, never your code or commit messages. The{' '}
        <Link href="/installation">installation guide</Link> lists every
        permission the app asks for.
      </Content>
    ),
    question: 'Does Octogriffin have access to my source code?',
  },
  {
    answer: (
      <Content>
        We take data sovereignty seriously. Our primary database is hosted in{' '}
        <strong>Frankfurt, Germany</strong> (via Neon), ensuring your data
        remains within the EU and is protected by strict privacy standards.
      </Content>
    ),
    question: 'Where is my data hosted?',
  },
  {
    answer: (
      <Content>
        You remain in control. You can uninstall the GitHub App from your
        repository settings at any time, which immediately stops all data flow.
        You can also regenerate your Habitica API Token by resetting the
        password of your Habitica account to invalidate the old credentials
        instantly.
      </Content>
    ),
    question: 'How do I revoke access?',
  },
];

const gameplay: FAQ[] = [
  {
    answer: (
      <Content>
        A single push rewards each trigger at most 10 times, no matter how many
        commits it contains. Beyond that, we operate on the &quot;honor
        system.&quot; Smart Spam Detection and Daily Caps are top priorities in
        our upcoming <Link href="/roadmap">Anti-Cheese</Link> update to help
        keep you honest.
      </Content>
    ),
    question: 'What prevents me from spamming commits for infinite Gold?',
  },
  {
    answer: (
      <Content>
        Yes! In the <strong>Control Freak</strong> update, you can set the
        Trigger Action to &quot;Punish&quot; (Down). This is perfect for
        discouraging bad habits, like pushing directly to the main branch or
        breaking the build.
      </Content>
    ),
    question: 'Can I lose health instead of gaining XP?',
  },
  {
    answer: (
      <Content>
        <strong>No.</strong> Deleting a trigger in Octogriffin only stops future
        events from processing. We do not delete your history or the associated
        task in Habitica. You can keep the task as a record or delete it
        manually in the Habitica app.
      </Content>
    ),
    question: 'If I delete a Trigger, does it delete the Task in Habitica?',
  },
];

const troubleshooting: FAQ[] = [
  {
    answer: (
      <Content>
        First, check if your trigger is set to <strong>Active</strong> in the
        dashboard. Second, ensure the GitHub App is actually installed on that
        specific repository. Finally, GitHub webhooks can sometimes have a delay
        of a few seconds.
      </Content>
    ),
    question: "I pushed code, but didn't get any XP. Why?",
  },
  {
    answer: (
      <Content>
        Did you recently reset your password or regenerate your API Token in
        Habitica? If so, your old credentials are invalid. Please go to the{' '}
        <Link href="/dashboard/settings">Settings</Link> page and update your
        API Token to resume syncing.
      </Content>
    ),
    question: 'My triggers suddenly stopped working.',
  },
  {
    answer: (
      <Content>
        Octogriffin tries to find a task with the exact title you specified. If
        you have multiple tasks with the same name (e.g. two tasks named
        &quot;Coding&quot;), we might score the wrong one. We recommend giving
        your tasks unique names or using the <strong>Task Alias</strong> feature
        in the Advanced Settings of your trigger for 100% precision.
      </Content>
    ),
    question: 'It is scoring the wrong Habitica task.',
  },
  {
    answer: (
      <Content>
        Check your <Link href="/dashboard">Dashboard</Link>. You might have
        created two overlapping triggers (e.g., one Global trigger and one
        Repository-specific trigger) that both fire on &quot;Push&quot; events.
        Disable one of them to fix the issue.
      </Content>
    ),
    question: "I'm getting double XP for the same event.",
  },
];

const sections = [
  { faqs: setup, id: 'setup', title: 'Setup' },
  { faqs: dataPrivacy, id: 'privacy', title: 'Data privacy' },
  { faqs: gameplay, id: 'gameplay', title: 'Gameplay' },
  { faqs: troubleshooting, id: 'trouble', title: 'Troubleshooting' },
];

export default function FaqPage() {
  const currentPhase = getCurrentPhase();

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <PageHeader
        description="Everything about setup, how rewards are calculated, and what happens to your data."
        title="Habitica GitHub integration FAQ"
      />
      <Shell className="flex flex-col gap-12 pt-12 pb-24">
        <div className="flex flex-wrap items-start gap-12">
          <nav
            aria-label="Topics"
            className="flex flex-[1_1_200px] flex-col gap-0.5"
          >
            {sections.map(({ faqs, id, title }) => (
              <a
                className="flex justify-between rounded-[8px] px-3 py-2 text-sm font-medium text-text-2 transition-colors duration-[var(--dur-fast)] hover:bg-fill hover:text-text"
                href={`#${id}`}
                key={id}
              >
                {title}
                <span className="text-muted">{faqs.length}</span>
              </a>
            ))}
          </nav>

          <div className="flex max-w-[780px] min-w-0 flex-[999_1_620px] flex-col gap-12">
            {sections.map(({ faqs, id, title }, sectionIndex) => (
              <section
                aria-labelledby={`${id}-heading`}
                className="flex scroll-mt-24 flex-col gap-4"
                id={id}
                key={id}
              >
                <Heading id={`${id}-heading`} level={2}>
                  {title}
                </Heading>
                <AccordionGroup openIndex={sectionIndex === 0 ? 0 : undefined}>
                  {faqs.map(faq => (
                    <Accordion key={faq.question} title={faq.question}>
                      {faq.answer}
                    </Accordion>
                  ))}
                </AccordionGroup>
              </section>
            ))}

            <NextLink
              className="flex w-fit items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-text shadow-e1 transition-colors duration-[var(--dur-fast)] hover:bg-sunken"
              href="/roadmap"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_4px_var(--accent-soft)]"
              />
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">
                  {currentPhase.codename} is in progress
                </span>
                <span className="text-xs text-muted">
                  Cooldowns, daily caps and bot filtering, on the roadmap
                </span>
              </span>
            </NextLink>

            <section className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-border bg-surface p-7 shadow-e1">
              <div className="flex flex-col gap-1">
                <Heading level={2} size="h3">
                  Still stuck?
                </Heading>
                <p className="text-[15px] text-text-2">
                  Send the delivery ID from your History tab and we&apos;ll
                  trace what happened.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <Button
                  render={
                    <a
                      href={githubRepositoryUrl('/issues/new')}
                      rel="noreferrer"
                      target="_blank"
                    />
                  }
                  variant="secondary"
                >
                  Open an issue
                </Button>
                <Button render={<a href={`mailto:${supportEmail()}`} />}>
                  <HugeiconsIcon icon={Mail01Icon} size={16} />
                  Email support
                </Button>
              </div>
            </section>
          </div>
        </div>
      </Shell>
    </>
  );
}
