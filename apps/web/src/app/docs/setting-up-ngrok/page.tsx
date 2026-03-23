import { Metadata } from 'next';
import NextLink from 'next/link';

import { CheckmarkCircle02Icon, CommandLineIcon } from 'hugeicons-react';

import { DocsFeedback } from '@/components/docs/DocsFeedback';
import { DocsStep } from '@/components/docs/DocsStep';
import { Link } from '@/components/Link';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Code } from '@/components/ui/Code';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { generatePageMetadata } from '@/utils/seo';

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePageMetadata({
    title: 'Setting up Ngrok',
    description:
      'How to expose your local development environment to GitHub webhooks using Ngrok.',
    suffix: 'Octogriffin Docs',
    path: 'docs/setting-up-ngrok',
  });
};

export default function DocsSettingUpNgrokPage() {
  return (
    <div className="max-w-3xl space-y-12 pb-20">
      <div>
        <Heading level={1} className="mb-4">
          Setting up Ngrok
        </Heading>
        <Content size="lg">
          GitHub needs to send webhooks to your machine to trigger events. Since{' '}
          <code className="bg-slate-100 px-1 rounded text-sm dark:bg-slate-800">
            localhost
          </code>{' '}
          isn&#39;t accessible from the internet, we use <strong>ngrok</strong>{' '}
          to create a secure tunnel.
        </Content>
      </div>

      {/* Why Ngrok? */}
      <Alert variant="info" title="Why do we use Ngrok?">
        While GitHub provides a tool called{' '}
        <code className="font-bold">smee-client</code>, we prefer ngrok because
        it provides a <strong>Static Domain</strong> on the free plan. This
        means you don&#39;t have to update your GitHub App settings every time
        you restart your computer.
      </Alert>

      {/* Step 1: Install */}
      <DocsStep step={1} heading="Install Ngrok CLI">
        <Content>
          Download and install the ngrok command line tool for your operating
          system from the official website.
        </Content>
        <div className="mt-4">
          <Button
            variant="black"
            render={
              <NextLink
                href="https://ngrok.com/download"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            Go to ngrok.com/download
          </Button>
        </div>
      </DocsStep>

      {/* Step 2: Account */}
      <DocsStep step={2} heading="Create Account & Authenticate">
        <Content>
          Create a free account on{' '}
          <Link href="https://ngrok.com" target="_blank">
            ngrok.com
          </Link>
          . Once logged in, copy your Authtoken from the dashboard and run:
        </Content>
        <Code
          code={['ngrok config add-authtoken YOUR_TOKEN']}
          disableNumbers
          icon={CommandLineIcon}
          language="bash"
        />
      </DocsStep>

      {/* Step 3: Domain */}
      <DocsStep step={3} heading="Locate Static Domain">
        <Content>
          Ngrok automatically assigns a free static domain to your account. You
          can find it in the dashboard under{' '}
          <strong>Universal Gateway &gt; Domains</strong>. It will look
          something like:
        </Content>
        <Code
          code={['corgi-giving-purely.ngrok-free.dev']}
          disableNumbers
          icon={CommandLineIcon}
          language="bash"
        />
      </DocsStep>

      {/* Step 4: Configuration */}
      <DocsStep step={4} heading="Configure Tunnel Agent">
        <Content>
          Instead of typing long flags every time, we will define a persistent
          configuration. Open your ngrok configuration file:
        </Content>

        <Code
          code={['ngrok config edit']}
          disableNumbers
          icon={CommandLineIcon}
          language="bash"
        />

        <Content className="mt-4">
          Add the following block to the end of the file. Be sure to replace the
          domain with the one you found in Step 3.
        </Content>

        <Code
          code={[
            'version: "3"',
            'agent:',
            '  authtoken: ... (already here)',
            'tunnels:',
            '  octogriffin:',
            '    proto: http',
            '    addr: 3000',
            '    domain: YOUR_DOMAIN.ngrok-free.dev',
          ]}
          disableNumbers
          language="yml"
        />
      </DocsStep>

      {/* Step 5: Start */}
      <DocsStep step={5} heading="Start the Tunnel">
        <Content>
          Now you can start your tunnel with a single short command:
        </Content>

        <Code
          code={['ngrok start octogriffin']}
          disableNumbers
          icon={CommandLineIcon}
          language="bash"
        />

        <div className="mt-4 flex items-start gap-3 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
          <CheckmarkCircle02Icon
            className="shrink-0 text-emerald-600 dark:text-emerald-400"
            size={20}
          />
          <p>
            Your tunnel is now active at{' '}
            <span className="font-bold">
              https://YOUR_DOMAIN.ngrok-free.dev
            </span>
            . This URL will remain the same every time you run this command.
          </p>
        </div>
      </DocsStep>

      {/* Step 6: Update GitHub */}
      <DocsStep step={6} heading="Update GitHub App">
        <Content>Now tell GitHub to send events to this URL.</Content>
        <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-2 dark:text-slate-400">
          <li>
            Go to your{' '}
            <Link href="https://github.com/settings/apps" target="_blank">
              GitHub Apps settings
            </Link>
            .
          </li>
          <li>
            Click <strong>Edit</strong> next to your &#34;Octogriffin (Dev)&#34;
            app.
          </li>
          <li>
            Scroll down to <strong>Webhook URL</strong>.
          </li>
          <li>Paste your ngrok URL with the API path appended:</li>
        </ol>
        <Code
          code={['https://YOUR_DOMAIN.ngrok-free.dev/api/v1/webhook']}
          disableNumbers
          language="bash"
        />
      </DocsStep>

      <DocsFeedback />
    </div>
  );
}
