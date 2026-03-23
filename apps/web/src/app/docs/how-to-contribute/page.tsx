import { Metadata } from 'next';

import {
  GitForkIcon,
  GitPullRequestIcon,
  Message01Icon,
  PaintBoardIcon,
  Search01Icon,
  Settings02Icon,
  Tick02Icon,
} from 'hugeicons-react';

import { DocsFeedback } from '@/components/docs/DocsFeedback';
import { DocsResourceLink } from '@/components/docs/DocsResourceLink';
import { DocsStep } from '@/components/docs/DocsStep';
import { Alert } from '@/components/ui/Alert';
import { Code } from '@/components/ui/Code';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';
import { generatePageMetadata } from '@/utils/seo';

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePageMetadata({
    title: 'How to Contribute',
    description:
      'Guidelines for contributing to Octogriffin. Learn about our branching strategy, commit conventions, and pull request process.',
    suffix: 'Octogriffin Docs',
    path: 'docs/how-to-contribute',
  });
};

export default function DocsHowToContributePage() {
  return (
    <div className="max-w-3xl space-y-12 pb-20">
      {/* Header */}
      <div>
        <Heading level={1} className="mb-4">
          How to Contribute
        </Heading>
        <Content size="lg">
          We welcome contributions of all sizes! Whether you are fixing a typo,
          improving the UI, or building a new trigger integration, this guide
          will help you get your code merged.
        </Content>
      </div>

      {/* Step 1: Finding Work */}
      <DocsStep step={1} heading="Find a Task">
        <Content>
          We use <strong>GitHub Milestones</strong> to organize upcoming
          releases. Before starting, check the{' '}
          <a
            href={githubRepositoryUrl('/milestones')}
            target="_blank"
            className="text-violet-600 hover:underline font-medium dark:text-violet-400"
          >
            Active Milestone
          </a>{' '}
          to see what work is prioritized.
        </Content>
        <div className="mt-4 flex items-start gap-3 rounded-lg bg-slate-50 p-4 border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
          <Search01Icon
            className="shrink-0 text-slate-500 mt-0.5 dark:text-slate-400"
            size={20}
          />
          <Content size="sm">
            Look for issues labeled{' '}
            <strong className="text-emerald-600 dark:text-emerald-400">
              good first issue
            </strong>{' '}
            or{' '}
            <strong className="text-violet-600 dark:text-violet-400">
              help wanted
            </strong>{' '}
            if you are new to the project.
          </Content>
        </div>
      </DocsStep>

      {/* Step 2: Forking */}
      <DocsStep step={2} heading="Fork the Repository">
        <Content>
          You cannot push directly to the main repository. You must create your
          own copy (fork) to work on.
        </Content>
        <ol className="mt-3 list-decimal list-inside space-y-2 text-slate-600 ml-2 dark:text-slate-400">
          <li>
            Click the <strong>Fork</strong> button in the top-right corner of
            the GitHub repo.
          </li>
          <li>Clone your fork locally:</li>
        </ol>
        <div className="mt-4">
          <Code
            code={[
              'git clone https://github.com/YOUR_USERNAME/octogriffin.git',
            ]}
            language="bash"
            disableNumbers
            icon={GitForkIcon}
          />
        </div>

        <div className="mt-4">
          <DocsResourceLink
            href="/docs/dev-setup"
            title="First time setup?"
            description="Follow our guide to configure Docker, Ngrok, and the GitHub App."
            icon={<Settings02Icon size={18} />}
          />
        </div>
      </DocsStep>

      {/* Step 3: Branching */}
      <DocsStep step={3} heading="Branching Strategy">
        <Content>
          Create a new branch for your work. Do not commit directly to your
          fork&#39;s{' '}
          <code className="bg-slate-100 px-1 rounded text-sm dark:bg-slate-800">
            main
          </code>{' '}
          branch.
        </Content>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mb-2 flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
              <GitForkIcon
                size={18}
                className="text-violet-600 dark:text-violet-400"
              />
              <span>Features</span>
            </div>
            <code className="text-sm text-slate-600 dark:text-slate-400">
              feature/add-new-trigger
            </code>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mb-2 flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
              <GitForkIcon
                size={18}
                className="text-emerald-600 dark:text-emerald-400"
              />
              <span>Fixes</span>
            </div>
            <code className="text-sm text-slate-600 dark:text-slate-400">
              fix/auth-redirect-bug
            </code>
          </div>
        </div>
      </DocsStep>

      {/* Step 4: Commits */}
      <DocsStep step={4} heading="Conventional Commits">
        <Content>
          We use <strong>Release Please</strong> to automate versioning. For
          this to work, your commit messages <strong>must</strong> follow the{' '}
          <a
            href="https://www.conventionalcommits.org/"
            target="_blank"
            className="text-violet-600 hover:underline dark:text-violet-400"
          >
            Conventional Commits
          </a>{' '}
          specification.
        </Content>

        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <Tick02Icon
              className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
              size={20}
            />
            <div className="space-y-1">
              <p className="font-bold text-emerald-900 dark:text-emerald-300">
                Good Examples
              </p>
              <ul className="list-disc list-inside text-sm text-emerald-800 space-y-1 font-mono dark:text-emerald-400">
                <li>feat: add new habitica trigger</li>
                <li>fix: resolve webhook timeout issue</li>
                <li>docs: update setup guide</li>
                <li>chore: bump dependencies</li>
              </ul>
            </div>
          </div>

          <Alert variant="note">
            If your PR introduces a breaking change, add a{' '}
            <code className="font-bold">!</code> after the type (e.g.,{' '}
            <code className="font-bold">feat!: drop support for v1 api</code>).
          </Alert>
        </div>
      </DocsStep>

      {/* Step 5: Development */}
      <DocsStep step={5} heading="Development Standards">
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
              <PaintBoardIcon
                size={20}
                className="text-violet-600 dark:text-violet-400"
              />
              <span>UI Components</span>
            </div>
            <Content size="sm">
              Use the existing UI components in{' '}
              <code className="bg-slate-100 px-1 rounded dark:bg-slate-800">
                src/components/ui
              </code>{' '}
              whenever possible. Do not hardcode colors; use Tailwind classes
              like{' '}
              <code className="text-violet-600 dark:text-violet-400">
                text-slate-600
              </code>{' '}
              or{' '}
              <code className="text-violet-600 dark:text-violet-400">
                bg-violet-50
              </code>{' '}
              to ensure the theme remains consistent.
            </Content>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
              <Message01Icon
                size={20}
                className="text-violet-600 dark:text-violet-400"
              />
              <span>Icons</span>
            </div>
            <Content size="sm">
              We use <strong>Hugeicons React</strong> (Free). Always use the
              standard stroke variant. Do not use premium styles like{' '}
              <code className="bg-slate-100 px-1 rounded text-xs dark:bg-slate-800">
                bulk
              </code>
              ,{' '}
              <code className="bg-slate-100 px-1 rounded text-xs dark:bg-slate-800">
                solid
              </code>
              , or{' '}
              <code className="bg-slate-100 px-1 rounded text-xs dark:bg-slate-800">
                twotone
              </code>
              .
            </Content>
          </div>
        </div>
      </DocsStep>

      {/* Step 6: Pull Request */}
      <DocsStep step={6} heading="Open a Pull Request">
        <Content>
          When your code is ready, push your branch to your fork and open a Pull
          Request against{' '}
          <code className="bg-slate-100 px-1 rounded text-sm dark:bg-slate-800">
            main
          </code>
          .
        </Content>
        <ul className="mt-3 list-disc list-inside space-y-2 text-slate-600 pl-2 dark:text-slate-400">
          <li>Ensure the build passes locally.</li>
          <li>
            Link any relevant issues (e.g., &quot;Closes #123&quot;) in the
            description.
          </li>
          <li>
            If you added a new feature, please include a screenshot or video.
          </li>
        </ul>
        <div className="mt-4">
          <Code
            code={['git push -u origin feature/my-cool-feature']}
            language="bash"
            disableNumbers
            icon={GitPullRequestIcon}
          />
        </div>
      </DocsStep>

      <DocsFeedback />
    </div>
  );
}
