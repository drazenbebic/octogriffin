import type { Metadata } from 'next';

import { Mail01Icon } from '@hugeicons/core-free-icons';

import { JsonLd } from '@/components/JsonLd';
import type { LegalSection } from '@/components/LegalPage';
import { LegalPage } from '@/components/LegalPage';
import { Callout } from '@/components/ui/Callout';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { termsJsonLd } from '@/json-ld/terms';
import { pageMetadata } from '@/seo/pageCatalog';
import { supportEmail } from '@/utils/supportEmail';

export const metadata: Metadata = pageMetadata('/terms-and-conditions');

const LAST_UPDATED = '2026-01-12';

const sections: LegalSection[] = [
  { id: 'introduction', label: 'Introduction', number: '1' },
  {
    id: 'description-of-service',
    label: 'Description of Service',
    number: '2',
  },
  { id: 'user-responsibilities', label: 'User Responsibilities', number: '3' },
  {
    id: 'limitation-of-liability',
    label: 'Limitation of Liability',
    number: '4',
  },
  { id: 'intellectual-property', label: 'Intellectual Property', number: '5' },
  { id: 'termination', label: 'Termination', number: '6' },
  { id: 'governing-law', label: 'Governing Law', number: '7' },
];

export default function TermsAndConditionsPage() {
  const email = supportEmail();

  return (
    <>
      <JsonLd data={termsJsonLd} />
      <LegalPage
        sections={sections}
        title="Terms & conditions"
        updated={LAST_UPDATED}
      >
        <div className="flex flex-col gap-10">
          {/* 1. Introduction */}
          <section className="scroll-mt-24" id="introduction">
            <Heading className="mb-4" level={2} size="h3">
              1. Introduction
            </Heading>
            <Content className="mb-4">
              Welcome to <strong>Octogriffin</strong>. By accessing our website,
              installing our GitHub App, or using our services, you agree to be
              bound by these Terms and Conditions.
            </Content>
            <Content>
              These terms constitute a legally binding agreement between you
              (&#34;the User&#34;) and <strong>Drazen Bebic</strong> (&#34;the
              Operator&#34;, &#34;we&#34;, &#34;us&#34;), based in Vienna,
              Austria.
            </Content>
          </section>

          {/* 2. Description of Service */}
          <section className="scroll-mt-24" id="description-of-service">
            <Heading className="mb-4" level={2} size="h3">
              2. Description of Service
            </Heading>
            <Content className="mb-4">
              Octogriffin is a third-party integration tool that connects GitHub
              activity to the Habitica gamification platform.
            </Content>
            <ul className="list-disc space-y-2 pl-5 text-text-2 ">
              <Content as="li">
                We automate the completion of tasks, scoring of habits, or
                gaining of XP based on your actions on GitHub (e.g., pushing
                code, merging PRs).
              </Content>
              <Content as="li">
                <strong>Disclaimer:</strong> This application is not affiliated
                with, endorsed by, or sponsored by Habitica (HabitRPG, Inc.).
                &#34;Habitica&#34; is a trademark of HabitRPG, Inc.
              </Content>
            </ul>
          </section>

          {/* 3. User Responsibilities */}
          <section className="scroll-mt-24" id="user-responsibilities">
            <Heading className="mb-4" level={2} size="h3">
              3. User Responsibilities
            </Heading>
            <Content className="mb-4">
              By using this service, you agree to the following
              responsibilities:
            </Content>
            <ul className="list-disc space-y-2 pl-5 text-text-2 ">
              <Content as="li">
                <strong>Security:</strong> You are responsible for keeping your
                Habitica API User ID and Token secure. While we encrypt this
                data, you should not share these credentials publicly.
              </Content>
              <Content as="li">
                <strong>Fair Play:</strong> You agree not to abuse the system by
                generating artificial GitHub activity (e.g., spamming empty
                commits) solely for the purpose of gaining in-game rewards
                (&#34;Gold Farming&#34;). We reserve the right to ban accounts
                engaging in such behavior.
              </Content>
              <Content as="li">
                <strong>Account Access:</strong> You must maintain control of
                your GitHub account. If you lose access to GitHub, you may lose
                access to our settings panel.
              </Content>
            </ul>
          </section>

          {/* 4. Limitation of Liability */}
          <section className="scroll-mt-24" id="limitation-of-liability">
            <Heading className="mb-4" level={2} size="h3">
              4. Limitation of Liability
            </Heading>
            <div className="rounded-2xl border border-xp/30 bg-xp-soft p-6 ">
              <Content className="mb-2 font-semibold text-xp ">
                Service Provided &#34;As Is&#34;
              </Content>
              <Content className="text-xp ">
                We provide this service for free and on an &#34;as is&#34;
                basis. We do not guarantee 100% uptime. We are not liable for
                any in-game losses (e.g., loss of a &#34;Streak&#34;, death of a
                character, or loss of items) caused by service outages, API
                errors, or delays in webhook processing.
              </Content>
            </div>
          </section>

          {/* 5. Intellectual Property */}
          <section className="scroll-mt-24" id="intellectual-property">
            <Heading className="mb-4" level={2} size="h3">
              5. Intellectual Property
            </Heading>
            <Content className="mb-4">
              <strong>5.1. Source Code:</strong> The source code for Octogriffin
              is available under the{' '}
              <strong>GNU Affero General Public License v3.0 (AGPL-3.0)</strong>
              . You are free to view, modify, and self-host a copy of the
              software in accordance with the terms of that license.
            </Content>
            <Content>
              <strong>5.2. Service & Trademarks:</strong> While the code is open
              source, the &#34;Octogriffin&#34; service provided on this
              website, the visual design, the &#34;Octogriffin&#34; name, and
              the branding are the intellectual property of the Operator. You
              may not use our trademarks or trade dress in a way that causes
              confusion or implies affiliation.
            </Content>
          </section>

          {/* 6. Termination */}
          <section className="scroll-mt-24" id="termination">
            <Heading className="mb-4" level={2} size="h3">
              6. Termination
            </Heading>
            <Content>
              We reserve the right to suspend or terminate your access to the
              Service at any time, without notice, for conduct that we believe
              violates these Terms or is harmful to other users, us, or third
              parties (including Habitica).
            </Content>
          </section>

          {/* 7. Governing Law */}
          <section className="scroll-mt-24" id="governing-law">
            <Heading className="mb-4" level={2} size="h3">
              7. Governing Law
            </Heading>
            <Content>
              These Terms shall be governed and construed in accordance with the
              laws of <strong>Austria</strong>, without regard to its conflict
              of law provisions.
            </Content>
          </section>

          <Callout
            button={{
              href: `mailto:${email}`,
              icon: Mail01Icon,
              label: 'Send Email',
            }}
            description={`For any legal inquiries regarding these terms, reach out to ${email}.`}
            title="Contact Us"
          />
        </div>
      </LegalPage>
    </>
  );
}
