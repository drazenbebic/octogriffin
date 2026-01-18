import { ReactNode } from 'react';
import { Metadata } from 'next';

import { HelpCircleIcon, Mail01Icon } from 'hugeicons-react';

import { Link } from '@/components/Link';
import { Accordion } from '@/components/ui/Accordion';
import { AccordionGroup } from '@/components/ui/AccordionGroup';
import { Button } from '@/components/ui/Button';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { supportEmail } from '@/utils/supportEmail';

type FAQ = {
  question: string;
  answer: ReactNode;
};

export const metadata: Metadata = {
  title: 'FAQs',
  description:
    'Common questions about how Octogriffin processes your GitHub activity and rewards you.',
};

const setup: FAQ[] = [
  {
    question: 'Is this free to use?',
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
  },
  {
    question: 'How do I install Octogriffin?',
    answer: (
      <>
        <Content className="mb-4">
          It is a simple two-step process. First, install our GitHub App on the
          repositories you want to track. Second, log in to the{' '}
          <Link href="/dashboard/settings">Dashboard</Link> and enter your
          Habitica User ID and API Token (found in your Habitica Settings API).
        </Content>
        <Content>
          You&#39;re now ready to configure your triggers and start earning
          Gold/XP!
        </Content>
      </>
    ),
  },
  {
    question: 'How do I configure my rewards?',
    answer: (
      <Content>
        Once linked, head to the <Link href="/dashboard">Dashboard</Link> to
        create <strong>Triggers</strong>. You decide the rules:{' '}
        <em>
          &#34;When I [Push Code] to [This Repo], score a [Medium] task&#34;
        </em>
        . You can create as many triggers as you want for different events and
        repositories.
      </Content>
    ),
  },
  {
    question: 'Does this work with private repositories?',
    answer: (
      <Content>
        Absolutely. Since Octogriffin works as a GitHub App, you explicitly
        grant it access to specific repositories - whether they are public or
        private. We process the webhooks securely regardless of visibility.
      </Content>
    ),
  },
  {
    question: 'How exactly does the syncing work?',
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
  },
];

const dataPrivacy: FAQ[] = [
  {
    question: 'Is my Habitica API Token secure?',
    answer: (
      <Content>
        Your API credentials are <strong>encrypted at rest</strong> in our
        database using industry-standard encryption (AES-256). We never expose
        them in the frontend, and they are only decrypted momentarily by our
        server to send requests to Habitica on your behalf.
      </Content>
    ),
  },
  {
    question: 'Does Octogriffin have access to my source code?',
    answer: (
      <Content>
        <strong>No.</strong> We strictly request the minimum permissions
        required to function. We do not request access to your code contents
        (`contents: read`), so we technically cannot see or store your actual
        source code.
      </Content>
    ),
  },
  {
    question: 'Where is my data hosted?',
    answer: (
      <Content>
        We take data sovereignty seriously. Our primary database is hosted in{' '}
        <strong>Frankfurt, Germany</strong> (via Neon), ensuring your data
        remains within the EU and is protected by strict privacy standards.
      </Content>
    ),
  },
  {
    question: 'How do I revoke access?',
    answer: (
      <Content>
        You remain in control. You can uninstall the GitHub App from your
        repository settings at any time, which immediately stops all data flow.
        You can also regenerate your Habitica API Token by resetting the
        password of your Habitica account to invalidate the old credentials
        instantly.
      </Content>
    ),
  },
];

const gameplay: FAQ[] = [
  {
    question: 'What prevents me from spamming commits for infinite Gold?',
    answer: (
      <Content>
        Currently, we operate on the &quot;honor system.&quot; However, Smart
        Spam Detection and Daily Caps are top priorities in our upcoming{' '}
        <Link href="/roadmap" className="text-violet-600 hover:underline">
          Anti-Cheese
        </Link>{' '}
        update to help keep you honest.
      </Content>
    ),
  },
  {
    question: 'Can I lose health instead of gaining XP?',
    answer: (
      <Content>
        Yes! In the <strong>Control Freak</strong> update, you can set the
        Trigger Action to &quot;Punish&quot; (Down). This is perfect for
        discouraging bad habits, like pushing directly to the main branch or
        breaking the build.
      </Content>
    ),
  },
  {
    question: "I pushed code, but didn't get any XP. Why?",
    answer: (
      <Content>
        First, check if your trigger is set to <strong>Active</strong> in the
        dashboard. Second, ensure the GitHub App is actually installed on that
        specific repository. Finally, GitHub webhooks can sometimes have a delay
        of a few seconds.
      </Content>
    ),
  },
  {
    question: 'If I delete a Trigger, does it delete the Task in Habitica?',
    answer: (
      <Content>
        <strong>No.</strong> Deleting a trigger in Octogriffin only stops future
        events from processing. We do not delete your history or the associated
        task in Habitica. You can keep the task as a record or delete it
        manually in the Habitica app.
      </Content>
    ),
  },
];

const troubleshooting: FAQ[] = [
  {
    question: "I pushed code, but didn't get any XP. Why?",
    answer: (
      <Content>
        First, check if your trigger is set to <strong>Active</strong> in the
        dashboard. Second, ensure the GitHub App is actually installed on that
        specific repository. Finally, GitHub webhooks can sometimes have a delay
        of a few seconds.
      </Content>
    ),
  },
  {
    question: 'My triggers suddenly stopped working.',
    answer: (
      <Content>
        Did you recently reset your password or regenerate your API Token in
        Habitica? If so, your old credentials are invalid. Please go to the{' '}
        <Link href="/dashboard/settings">Settings</Link> page and update your
        API Token to resume syncing.
      </Content>
    ),
  },
  {
    question: 'It is scoring the wrong Habitica task.',
    answer: (
      <Content>
        Octogriffin tries to find a task with the exact title you specified. If
        you have multiple tasks with the same name (e.g. two tasks named
        &quot;Coding&quot;), we might score the wrong one. We recommend giving
        your tasks unique names or using the <strong>Task Alias</strong> feature
        in the Advanced Settings of your trigger for 100% precision.
      </Content>
    ),
  },
  {
    question: "I'm getting double XP for the same event.",
    answer: (
      <Content>
        Check your <Link href="/dashboard">Dashboard</Link>. You might have
        created two overlapping triggers (e.g., one Global trigger and one
        Repository-specific trigger) that both fire on &quot;Push&quot; events.
        Disable one of them to fix the issue.
      </Content>
    ),
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
          <HelpCircleIcon size={32} />
        </div>
        <Heading level={1} size="3xl" className="mb-4">
          Frequently Asked Questions
        </Heading>
        <Content size="lg" className="mx-auto max-w-xl">
          Everything you need to know about the syncing process, XP
          calculations, and security.
        </Content>
      </div>

      <AccordionGroup className="mb-16">
        <Heading className="mb-4" size="2xl">
          Setup
        </Heading>
        {setup.map(faq => (
          <Accordion key={faq.question} title={faq.question}>
            {faq.answer}
          </Accordion>
        ))}

        <Heading className="mt-8 mb-4" size="2xl">
          Data Privacy
        </Heading>
        {dataPrivacy.map(faq => (
          <Accordion key={faq.question} title={faq.question}>
            {faq.answer}
          </Accordion>
        ))}

        <Heading className="mt-8 mb-4" size="2xl">
          Gameplay
        </Heading>
        {gameplay.map(faq => (
          <Accordion key={faq.question} title={faq.question}>
            {faq.answer}
          </Accordion>
        ))}

        <Heading className="mt-8 mb-4" size="2xl">
          Troubleshooting
        </Heading>
        {troubleshooting.map(faq => (
          <Accordion key={faq.question} title={faq.question}>
            {faq.answer}
          </Accordion>
        ))}
      </AccordionGroup>

      <div className="rounded-3xl bg-slate-50 p-8 text-center ring-1 ring-slate-100">
        <Heading level={3} size="lg" className="mb-3">
          Still have questions?
        </Heading>
        <Content className="mb-6">
          Can&#39;t find the answer you&#39;re looking for? Our support team is
          ready to assist.
        </Content>
        <Link href={`mailto:${supportEmail()}`}>
          <Button size="lg" variant="secondary">
            <Mail01Icon size={20} className="mr-2" />
            Contact Support
          </Button>
        </Link>
      </div>
    </div>
  );
}
