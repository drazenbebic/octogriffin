import type { Metadata } from 'next';

import {
  CheckListIcon,
  GitForkIcon,
  GitPullRequestIcon,
  Search01Icon,
  Settings02Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { DocsFeedback } from '@/components/docs/DocsFeedback';
import { DocsResourceLink } from '@/components/docs/DocsResourceLink';
import { DocsStep } from '@/components/docs/DocsStep';
import { JsonLd } from '@/components/JsonLd';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Code } from '@/components/ui/Code';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { howToContributeJsonLd } from '@/json-ld/docs/how-to-contribute';
import { pageMetadata } from '@/seo/pageCatalog';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';

export const metadata: Metadata = pageMetadata('/docs/how-to-contribute');

export default function DocsHowToContributePage() {
  return (
    <>
      <JsonLd data={howToContributeJsonLd} />
      <div className="max-w-3xl space-y-12 pb-20">
        {/* Header */}
        <div>
          <Heading className="mb-4" level={1}>
            How to Contribute
          </Heading>
          <Content size="lg">
            We welcome contributions of all sizes! Whether you are fixing a
            typo, improving the UI, or building a new trigger integration, this
            guide will help you get your code merged.
          </Content>
        </div>

        {/* Step 1: Finding Work */}
        <DocsStep heading="Find a Task" step={1}>
          <Content>
            We use <strong>GitHub Milestones</strong> to organize upcoming
            releases. Before starting, check the{' '}
            <a
              className="text-accent-text hover:underline font-medium "
              href={githubRepositoryUrl('/milestones')}
              target="_blank"
            >
              Active Milestone
            </a>{' '}
            to see what work is prioritized.
          </Content>
          <Card
            className="mt-4 flex flex-row items-start gap-3 p-4 "
            variant="sunken"
          >
            <HugeiconsIcon
              className="shrink-0 text-muted mt-0.5 "
              icon={Search01Icon}
              size={20}
            />
            <Content size="sm">
              Look for issues labeled{' '}
              <strong className="text-ok ">good first issue</strong> or{' '}
              <strong className="text-accent-text ">help wanted</strong> if you
              are new to the project.
            </Content>
          </Card>
        </DocsStep>

        {/* Step 2: Forking */}
        <DocsStep heading="Fork the Repository" step={2}>
          <Content>
            You cannot push directly to the main repository. You must create
            your own copy (fork) to work on.
          </Content>
          <ol className="mt-3 list-decimal list-inside space-y-2 text-text-2 ml-2 ">
            <Content as="li">
              Click the <strong>Fork</strong> button in the top-right corner of
              the GitHub repo.
            </Content>
            <Content as="li">Clone your fork locally:</Content>
          </ol>
          <div className="mt-4">
            <Code
              code={[
                'git clone https://github.com/YOUR_USERNAME/octogriffin.git',
              ]}
              disableNumbers
              icon={GitForkIcon}
              language="bash"
            />
          </div>

          <div className="mt-4">
            <DocsResourceLink
              description="Follow our guide to configure Docker, Ngrok, and the GitHub App."
              href="/docs/dev-setup"
              icon={<HugeiconsIcon icon={Settings02Icon} size={18} />}
              title="First time setup?"
            />
          </div>
        </DocsStep>

        {/* Step 3: Branching */}
        <DocsStep heading="Branching Strategy" step={3}>
          <Content>
            Create a new branch for your work. Do not commit directly to your
            fork&#39;s{' '}
            <code className="bg-fill px-1 rounded text-sm ">main</code> branch.
          </Content>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Card className="p-4 " variant="sunken">
              <div className="mb-2 flex items-center gap-2 font-bold text-text ">
                <HugeiconsIcon
                  className="text-accent-text "
                  icon={GitForkIcon}
                  size={18}
                />
                <span>Features</span>
              </div>
              <code className="text-sm text-text-2 ">
                feature/add-new-trigger
              </code>
            </Card>
            <Card className="p-4 " variant="sunken">
              <div className="mb-2 flex items-center gap-2 font-bold text-text ">
                <HugeiconsIcon
                  className="text-ok "
                  icon={GitForkIcon}
                  size={18}
                />
                <span>Fixes</span>
              </div>
              <code className="text-sm text-text-2 ">
                fix/auth-redirect-bug
              </code>
            </Card>
          </div>
        </DocsStep>

        {/* Step 4: Commits */}
        <DocsStep heading="Conventional Commits" step={4}>
          <Content>
            We use <strong>Release Please</strong> to automate versioning. For
            this to work, your commit messages <strong>must</strong> follow the{' '}
            <a
              className="text-accent-text hover:underline "
              href="https://www.conventionalcommits.org/"
              target="_blank"
            >
              Conventional Commits
            </a>{' '}
            specification.
          </Content>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-ok/30 bg-ok-soft p-4 ">
              <HugeiconsIcon
                className="mt-0.5 shrink-0 text-ok "
                icon={Tick02Icon}
                size={20}
              />
              <div className="space-y-1">
                <Content className="font-bold text-ok ">Good Examples</Content>
                <ul className="list-disc list-inside text-sm text-ok space-y-1 font-mono ">
                  <Content as="li">feat: add new habitica trigger</Content>
                  <Content as="li">fix: resolve webhook timeout issue</Content>
                  <Content as="li">docs: update setup guide</Content>
                  <Content as="li">chore: bump dependencies</Content>
                </ul>
              </div>
            </div>

            <Alert variant="note">
              If your PR introduces a breaking change, add a{' '}
              <code className="font-bold">!</code> after the type (e.g.,{' '}
              <code className="font-bold">feat!: drop support for v1 api</code>
              ).
            </Alert>
          </div>
        </DocsStep>

        {/* Step 5: Development */}
        <DocsStep heading="Development Standards" step={5}>
          <Content>
            Follow the project&apos;s conventions for code style, project
            structure, server actions, the design system and testing. Most of
            them are checked automatically by{' '}
            <code className="rounded-sm bg-fill px-1.5 py-0.5 font-mono text-[0.85em]">
              pnpm lint
            </code>{' '}
            and the tests.
          </Content>
          <div className="mt-4">
            <DocsResourceLink
              description="Checks, code style, project structure, the design system and testing."
              href="/docs/development-standards"
              icon={<HugeiconsIcon icon={CheckListIcon} size={18} />}
              title="Read the Development Standards"
            />
          </div>
        </DocsStep>

        {/* Step 6: Pull Request */}
        <DocsStep heading="Open a Pull Request" step={6}>
          <Content>
            When your code is ready, push your branch to your fork and open a
            Pull Request against{' '}
            <code className="bg-fill px-1 rounded text-sm ">main</code>.
          </Content>
          <ul className="mt-3 list-disc list-inside space-y-2 text-text-2 pl-2 ">
            <Content as="li">Ensure the build passes locally.</Content>
            <Content as="li">
              Link any relevant issues (e.g., &quot;Closes #123&quot;) in the
              description.
            </Content>
            <Content as="li">
              If you added a new feature, please include a screenshot or video.
            </Content>
          </ul>
          <div className="mt-4">
            <Code
              code={['git push -u origin feature/my-cool-feature']}
              disableNumbers
              icon={GitPullRequestIcon}
              language="bash"
            />
          </div>
        </DocsStep>

        <DocsFeedback />
      </div>
    </>
  );
}
