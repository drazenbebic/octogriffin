import type { Metadata } from 'next';

import { DocsFeedback } from '@/components/docs/DocsFeedback';
import { DocsStep } from '@/components/docs/DocsStep';
import { Link } from '@/components/Link';
import { Alert } from '@/components/ui/Alert';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { pageMetadata } from '@/seo/pageCatalog';

export const metadata: Metadata = pageMetadata('/docs/habitica-api-token');

export default function DocsHabiticaApiTokenPage() {
  return (
    <div className="max-w-3xl space-y-12 pb-20">
      <div>
        <Heading className="mb-4" level={1}>
          Find your Habitica User ID and API Token
        </Heading>
        <Content size="lg">
          Octogriffin needs two values from Habitica to score your tasks: your{' '}
          <strong>User ID</strong> and your <strong>API Token</strong>. Both are
          in your Habitica settings, under <strong>Site Data</strong>.
        </Content>
      </div>

      <DocsStep heading="Open your Habitica settings" step={1}>
        <Content>
          Log in at{' '}
          <Link href="https://habitica.com" target="_blank">
            habitica.com
          </Link>{' '}
          in a web browser. Click your user icon in the top-right corner and
          choose <strong>Settings</strong>.
        </Content>
      </DocsStep>

      <DocsStep heading="Go to Site Data" step={2}>
        <Content>
          Open the <strong>Site Data</strong> section. Older versions of
          Habitica call this section <strong>API</strong>. It shows your User ID
          and, behind a button, your API Token.
        </Content>
      </DocsStep>

      <DocsStep heading="Copy both values" step={3}>
        <Content>
          Copy your <strong>User ID</strong>, which looks like{' '}
          <code className="bg-fill px-1 rounded text-sm ">
            xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
          </code>
          {'. '}
          Then reveal your <strong>API Token</strong> and copy it as well.
        </Content>
      </DocsStep>

      <DocsStep heading="Paste them into Octogriffin" step={4}>
        <Content>
          Open the <Link href="/dashboard/settings">Settings</Link> tab of your
          Octogriffin dashboard, paste both values and click{' '}
          <strong>Save Configuration</strong>. Your Habitica stats appear in the
          dashboard once the connection works.
        </Content>
      </DocsStep>

      <Alert title="Keep your API Token secret" variant="warning">
        Your API Token works like a password for your Habitica account, so never
        share it or post it publicly. Octogriffin stores it encrypted and never
        sends it back to your browser. If you think it leaked, generate a new
        one in Habitica and enter it again in Octogriffin.
      </Alert>

      <Content>
        Next, choose which GitHub activity earns rewards. The list of{' '}
        <Link href="/docs/supported-github-events">
          supported GitHub events
        </Link>{' '}
        shows everything you can pick.
      </Content>

      <DocsFeedback />
    </div>
  );
}
