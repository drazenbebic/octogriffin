import type { Metadata } from 'next';

import { Mail01Icon } from '@hugeicons/core-free-icons';

import { JsonLd } from '@/components/JsonLd';
import type { LegalSection } from '@/components/LegalPage';
import { LegalPage } from '@/components/LegalPage';
import { Link } from '@/components/Link';
import { Callout } from '@/components/ui/Callout';
import { Card } from '@/components/ui/Card';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { privacyJsonLd } from '@/json-ld/privacy';
import { pageMetadata } from '@/seo/pageCatalog';
import { supportEmail } from '@/utils/supportEmail';

export const metadata: Metadata = pageMetadata('/privacy-policy');

const LAST_UPDATED = '2026-10-29';

const sections: LegalSection[] = [
  { id: 'introduction', label: 'Introduction', number: '1' },
  { id: 'controller', label: 'Controller', number: '2' },
  { id: 'the-data-we-collect', label: 'The Data We Collect', number: '3' },
  {
    id: 'activity-in-shared-repositories',
    label: 'Activity in Shared Repositories',
    number: '4',
  },
  {
    id: 'cookies-and-local-storage',
    label: 'Cookies & Local Storage',
    number: '5',
  },
  {
    id: 'infrastructure-and-data-processors',
    label: 'Infrastructure & Data Processors',
    number: '6',
  },
  { id: 'hosting-vercel', label: 'Hosting (Vercel)', level: 2, number: '6.1' },
  { id: 'database-neon', label: 'Database (Neon)', level: 2, number: '6.2' },
  { id: 'github', label: 'GitHub', level: 2, number: '6.3' },
  { id: 'habitica-api', label: 'Habitica API', level: 2, number: '6.4' },
  {
    id: 'analytics-and-performance',
    label: 'Analytics & Performance',
    level: 2,
    number: '6.5',
  },
  { id: 'sponsorships', label: 'Sponsorships', level: 2, number: '6.6' },
  { id: 'legal-basis', label: 'Legal Basis', number: '7' },
  { id: 'how-long-we-keep-data', label: 'How Long We Keep Data', number: '8' },
  { id: 'your-rights-gdpr', label: 'Your Rights (GDPR)', number: '9' },
];

export default function PrivacyPolicyPage() {
  const email = supportEmail();

  return (
    <>
      <JsonLd data={privacyJsonLd} />
      <LegalPage
        sections={sections}
        title="Privacy policy"
        updated={LAST_UPDATED}
      >
        <div className="flex flex-col gap-10">
          {/* 1. Introduction */}
          <section className="scroll-mt-24" id="introduction">
            <Heading className="mb-4" level={2} size="h3">
              1. Introduction
            </Heading>
            <Content>
              We respect your privacy and are committed to protecting your
              personal data. This privacy policy will inform you as to how we
              look after your personal data when you use our GitHub App and
              website, and tell you about your privacy rights.
            </Content>
          </section>

          {/* 2. Controller */}
          <section className="scroll-mt-24" id="controller">
            <Heading className="mb-4" level={2} size="h3">
              2. Controller
            </Heading>
            <Content className="mb-2">
              The data controller responsible for this website is:
            </Content>
            <Card className="px-6 py-4 " variant="sunken">
              <Content className="font-semibold">Drazen Bebic</Content>
              <Content>Postfach 0029 1190 Vienna, Austria</Content>
              <Content>Email: {email}</Content>
            </Card>
          </section>

          {/* 3. Data We Collect */}
          <section className="scroll-mt-24" id="the-data-we-collect">
            <Heading className="mb-4" level={2} size="h3">
              3. The Data We Collect
            </Heading>
            <Content className="mb-4">
              To provide the gamification service, we process the following
              data:
            </Content>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <Content as="li">
                <strong>GitHub Account Data:</strong> When you install the
                GitHub App or sign in, we store your GitHub username, user ID,
                account type and avatar, plus the public profile details GitHub
                shares with us: your display name, company, website, location,
                public email address and Gravatar ID. Fields you leave empty on
                GitHub stay empty with us.
              </Content>
              <Content as="li">
                <strong>Habitica Credentials:</strong> Your Habitica User ID and
                API Token. The token is stored using{' '}
                <strong>AES-256 encryption</strong> (Advanced Encryption
                Standard) in our database. It is only decrypted automatically,
                at the moment we send a request to Habitica on your behalf, and
                is never shown again after you save it.
              </Content>
              <Content as="li">
                <strong>Your Settings:</strong> The repositories you give the
                GitHub App access to, and the triggers you set up, including the
                Habitica task title, notes, tags and limits of each one.
              </Content>
              <Content as="li">
                <strong>Webhook Data:</strong> GitHub notifies us about activity
                in the repositories you selected, such as pushes, pull requests,
                issues, comments, discussions, releases, forks and wiki edits.
                We use these notifications to decide which of your tasks to
                score, and keep a short log of each delivery that rewarded you:
                its ID, event name and time, which you can see in your
                dashboard, plus the ID of the GitHub webhook it came through and
                GitHub&#39;s signature for it. We do not store the content of
                these notifications.
              </Content>
              <Content as="li">
                <strong>GitHub Marketplace Data:</strong> When you add, change
                or cancel Octogriffin through GitHub Marketplace, GitHub sends
                us the account and the person who made the change (their
                usernames, IDs and public profile links and avatars), and the
                chosen plan. We keep a record of these events, even if you never
                sign in to Octogriffin. We do not store organizations&apos;
                billing email addresses.
              </Content>
              <Content as="li">
                <strong>Your Country:</strong> The sponsors page shows prices in
                euros or US dollars, based on the country of your IP address or
                your browser&apos;s language. We use this only to pick the
                currency and do not store it.
              </Content>
            </ul>

            <blockquote className="px-6 py-4 rounded-2xl bg-accent-soft ">
              <Content className="font-medium " color="accent">
                Important: We do not access, read, or store your source code
                files.
              </Content>
            </blockquote>
          </section>

          {/* 4. Activity in shared repositories */}
          <section
            className="scroll-mt-24"
            id="activity-in-shared-repositories"
          >
            <Heading className="mb-4" level={2} size="h3">
              4. Activity in Shared Repositories
            </Heading>
            <Content>
              Octogriffin rewards whoever did something on GitHub, not only the
              person who installed it. If you have an Octogriffin account and
              push commits, open pull requests or comment in a repository where
              someone else installed Octogriffin, we match that activity to you
              by your GitHub username or ID and score your own triggers. People
              without an Octogriffin account are never rewarded, and we store
              nothing about them.
            </Content>
          </section>

          {/* 5. Cookies and local storage */}
          <section className="scroll-mt-24" id="cookies-and-local-storage">
            <Heading className="mb-4" level={2} size="h3">
              5. Cookies & Local Storage
            </Heading>
            <Content className="mb-4">
              We use a minimal number of cookies that are strictly necessary for
              the application to function. We do not use cookies for advertising
              or marketing purposes.
            </Content>
            <ul className="list-disc space-y-2 pl-6">
              <Content as="li">
                <strong>Authentication (NextAuth):</strong> We use secure,
                http-only cookies (e.g., <code>next-auth.session-token</code>)
                to maintain your active session while you are logged in.
              </Content>
              <Content as="li">
                <strong>Preferences:</strong> We use LocalStorage to remember
                whether you chose the light or dark theme. It stays in your
                browser and is never sent to us.
              </Content>
            </ul>
          </section>

          {/* 6. Infrastructure & Processors */}
          <section
            className="scroll-mt-24"
            id="infrastructure-and-data-processors"
          >
            <Heading className="mb-4" level={2} size="h3">
              6. Infrastructure & Data Processors
            </Heading>
            <Content className="mb-4">
              We use strictly selected third-party service providers to host our
              application and store data.
            </Content>

            <div className="space-y-6">
              <div>
                <Heading
                  className="mb-2"
                  id="hosting-vercel"
                  level={3}
                  size="h3"
                >
                  6.1. Hosting (Vercel)
                </Heading>
                <Content>
                  Our website and API functions are hosted on{' '}
                  <strong>Vercel Inc.</strong> (USA). Vercel processes standard
                  server logs (IP addresses, user agents) and our application
                  logs for security and debugging purposes. Vercel complies with
                  GDPR via standard contractual clauses.
                </Content>
              </div>

              <div>
                <Heading
                  className="mb-2"
                  id="database-neon"
                  level={3}
                  size="h3"
                >
                  6.2. Database (Neon)
                </Heading>
                <Content>
                  Our database is provided by <strong>Neon Inc.</strong> We have
                  configured our database instance to reside in the{' '}
                  <strong>AWS Frankfurt (eu-central-1)</strong> region to ensure
                  your data remains within the EU/EEA.
                </Content>
              </div>

              <div>
                <Heading className="mb-2" id="github" level={3} size="h3">
                  6.3. GitHub
                </Heading>
                <Content>
                  Sign-in, the GitHub App, webhooks and GitHub Marketplace are
                  provided by <strong>GitHub, Inc.</strong> (USA). GitHub sends
                  us the data described above, and avatars on our website are
                  loaded from GitHub. GitHub&apos;s own privacy statement
                  applies to your use of GitHub.
                </Content>
              </div>

              <div>
                <Heading className="mb-2" id="habitica-api" level={3} size="h3">
                  6.4. Habitica API
                </Heading>
                <Content>
                  To score your habits, we send requests to the{' '}
                  <strong>Habitica API</strong> using your Habitica User ID and
                  API Token. We create the tasks your triggers describe, score
                  them (e.g., &#34;Score Up Task X&#34;), add your chosen tags,
                  and read your day start and time zone so daily limits reset
                  when your Habitica day does. This is necessary for the core
                  functionality of the app.
                </Content>
              </div>

              <div>
                <Heading
                  className="mb-2"
                  id="analytics-and-performance"
                  level={3}
                  size="h3"
                >
                  6.5. Analytics & Performance
                </Heading>
                <Content>
                  We use <strong>Vercel Analytics</strong> and{' '}
                  <strong>Speed Insights</strong> to monitor the performance and
                  reliability of our website. These tools collect anonymous
                  usage data (e.g., page load speeds, device type, and country).
                  This data is aggregated and does not identify individual
                  visitors. We do not use tracking cookies for analytics.
                </Content>
              </div>

              <div>
                <Heading className="mb-2" id="sponsorships" level={3} size="h3">
                  6.6. Sponsorships
                </Heading>
                <Content>
                  Sponsorships and donations are handled entirely by{' '}
                  <strong>GitHub Sponsors</strong> and <strong>Ko-fi</strong>.
                  We never see your payment details. Their own privacy policies
                  apply when you sponsor us there.
                </Content>
              </div>
            </div>
          </section>

          {/* 7. Legal basis */}
          <section className="scroll-mt-24" id="legal-basis">
            <Heading className="mb-4" level={2} size="h3">
              7. Legal Basis
            </Heading>
            <Content className="mb-4">
              We process your data on the following legal bases under the GDPR:
            </Content>
            <ul className="list-disc space-y-2 pl-6">
              <Content as="li">
                <strong>Providing the service</strong> (Art. 6(1)(b) GDPR): your
                GitHub account data, Habitica credentials, settings, webhook
                data and the authentication cookie.
              </Content>
              <Content as="li">
                <strong>Our legitimate interests</strong> (Art. 6(1)(f) GDPR):
                keeping records of GitHub Marketplace events, server and
                application logs to keep the service secure and working,
                anonymous analytics, and showing prices in your currency.
              </Content>
            </ul>
          </section>

          {/* 8. Retention */}
          <section className="scroll-mt-24" id="how-long-we-keep-data">
            <Heading className="mb-4" level={2} size="h3">
              8. How Long We Keep Data
            </Heading>
            <ul className="list-disc space-y-2 pl-6">
              <Content as="li">
                <strong>Your account:</strong> Your GitHub account data,
                Habitica credentials, settings and webhook log are kept until
                you uninstall the GitHub App from every account you installed it
                on. We then delete all of it straight away.
              </Content>
              <Content as="li">
                <strong>GitHub Marketplace records:</strong> Kept after you
                uninstall, as a record of plan changes. Email us if you want
                yours removed.
              </Content>
              <Content as="li">
                <strong>Server and application logs:</strong> Kept by Vercel for
                a short period, then deleted automatically.
              </Content>
            </ul>
          </section>

          {/* 9. User Rights */}
          <section className="scroll-mt-24" id="your-rights-gdpr">
            <Heading className="mb-4" level={2} size="h3">
              9. Your Rights (GDPR)
            </Heading>
            <Content className="mb-4">
              Under the GDPR, you have the following rights:
            </Content>
            <ul className="mb-4 list-disc space-y-1 pl-6">
              <Content as="li">Right to access your stored data.</Content>
              <Content as="li">
                Right to rectification (update your keys).
              </Content>
              <Content as="li">
                Right to erasure (uninstall the GitHub App, which deletes your
                account and all related data, or email us).
              </Content>
              <Content as="li">
                Right to restrict processing (suspend the GitHub App or revoke
                its access to repositories).
              </Content>
              <Content as="li">
                Right to data portability (receive your data in a
                machine-readable format).
              </Content>
              <Content as="li">
                Right to object to processing based on our legitimate interests.
              </Content>
            </ul>
            <Content>
              To use any of these rights, email us. You also have the right to
              lodge a complaint with a supervisory authority. In Austria, this
              is the{' '}
              <Link href="https://www.dsb.gv.at" target="_blank">
                Österreichische Datenschutzbehörde
              </Link>{' '}
              (Barichgasse 40–42, 1030 Vienna).
            </Content>
          </section>

          <Callout
            button={{
              href: `mailto:${email}`,
              icon: Mail01Icon,
              label: 'Send Email',
            }}
            description={`If you have any questions about this policy, reach out to ${email}.`}
            title="Questions?"
          />
        </div>
      </LegalPage>
    </>
  );
}
