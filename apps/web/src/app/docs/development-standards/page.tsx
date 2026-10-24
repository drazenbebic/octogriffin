import type { Metadata } from 'next';
import type { FC, ReactNode } from 'react';

import { DocsFeedback } from '@/components/docs/DocsFeedback';
import { Link } from '@/components/Link';
import { Alert } from '@/components/ui/Alert';
import { Code } from '@/components/ui/Code';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { pageMetadata } from '@/seo/pageCatalog';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';

export const metadata: Metadata = pageMetadata('/docs/development-standards');

const sections = [
  { id: 'checks', label: 'Checks and tooling' },
  { id: 'code-style', label: 'Code style' },
  { id: 'structure', label: 'Project structure' },
  { id: 'server-actions', label: 'Server actions and data' },
  { id: 'ui', label: 'UI and the design system' },
  { id: 'testing', label: 'Testing' },
  { id: 'commits', label: 'Commits and changelog' },
  { id: 'database', label: 'Database changes' },
];

const C: FC<{ children: ReactNode }> = ({ children }) => (
  <code className="rounded-sm bg-fill px-1.5 py-0.5 font-mono text-[0.85em] text-text">
    {children}
  </code>
);

const Table: FC<{ head: [string, string]; rows: [ReactNode, ReactNode][] }> = ({
  head,
  rows,
}) => (
  <div className="overflow-x-auto rounded-lg border border-border">
    <table className="w-full text-left text-sm">
      <thead className="bg-sunken text-xs font-semibold text-muted">
        <tr>
          <th className="px-4 py-2.5" scope="col">
            {head[0]}
          </th>
          <th className="px-4 py-2.5" scope="col">
            {head[1]}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([first, second], index) => (
          <tr className="border-t border-line align-top" key={index}>
            <td className="px-4 py-3 whitespace-nowrap">{first}</td>
            <td className="px-4 py-3 text-text-2">{second}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Section: FC<{ children: ReactNode; id: string; title: string }> = ({
  children,
  id,
  title,
}) => (
  <section className="flex scroll-mt-24 flex-col gap-4" id={id}>
    <Heading level={2}>{title}</Heading>
    {children}
  </section>
);

const List: FC<{ children: ReactNode }> = ({ children }) => (
  <ul className="flex list-disc flex-col gap-2 pl-5 text-text-2 marker:text-faint">
    {children}
  </ul>
);

export default function DocsDevelopmentStandardsPage() {
  return (
    <div className="flex max-w-3xl flex-col gap-12 pb-20">
      <div className="flex flex-col gap-4">
        <Heading level={1}>Development Standards</Heading>
        <Content size="lg">
          The conventions that keep Octogriffin consistent: how the code is
          checked, organised, styled and tested. Most of them are enforced by
          tooling, so if a check fails, this page explains why it exists.
        </Content>
        <nav aria-label="On this page" className="flex flex-wrap gap-1.5 pt-1">
          {sections.map(({ id, label }) => (
            <a
              className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-2 transition-colors duration-[var(--dur-fast)] hover:border-border-strong hover:text-text"
              href={`#${id}`}
              key={id}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <Section id="checks" title="Checks and tooling">
        <Content>
          The repository is a pnpm workspace: the website and dashboard live in{' '}
          <C>apps/web</C> (Next.js), the API in <C>apps/api</C> (Hono), and the
          database schema in <C>packages/database</C>. Run every command from
          the repository root unless it says otherwise.
        </Content>
        <Table
          head={['Command', 'What it checks']}
          rows={[
            [
              <C key="l">pnpm lint</C>,
              'ESLint with Prettier, plus the design-token check (pnpm lint:tokens).',
            ],
            [
              <C key="t">pnpm --filter @octogriffin/web exec tsc --noEmit</C>,
              'TypeScript in strict mode.',
            ],
            [<C key="j">pnpm test</C>, 'Jest unit and component tests.'],
            [<C key="b">pnpm build</C>, 'A production build of every app.'],
            [
              <C key="k">pnpm knip</C>,
              'Unused files, exports and dependencies.',
            ],
          ]}
        />
        <Content>
          CI runs lint, types, tests and the build on every pull request. Husky
          runs the same checks locally: ESLint and Prettier on staged files
          before each commit, commitlint on the message, and lint, tests and the
          build before each push.
        </Content>
      </Section>

      <Section id="code-style" title="Code style">
        <List>
          <li>
            <strong>TypeScript, strict.</strong> No <C>any</C> to silence the
            compiler. Import types with <C>import type</C>; the linter rewrites
            mixed imports for you.
          </li>
          <li>
            <strong>Prettier decides formatting:</strong> 80 columns, single
            quotes, semicolons, trailing commas, and no parentheses around a
            single arrow-function parameter.
          </li>
          <li>
            <strong>Everything is sorted.</strong> The perfectionist rules sort
            imports, object keys, JSX props, union types and array literals
            alphabetically. When order carries meaning, for example
            Habitica&apos;s STR, INT, CON, PER, don&apos;t write it as an array
            literal; derive it from ranks, as <C>attributeOrder</C> does.
          </li>
          <li>
            <strong>A blank line before returns and after blocks,</strong>{' '}
            braces on every <C>if</C> and loop.
          </li>
          <li>
            <strong>No console logging.</strong> Use the logger in{' '}
            <C>src/lib/logger.ts</C> on the server; unused imports and variables
            fail the build.
          </li>
          <li>
            <strong>Comments explain why, not what.</strong> Name things after
            what users see (<C>describeTrigger</C>, <C>recipeToTriggerValues</C>
            ), not after the implementation.
          </li>
        </List>
      </Section>

      <Section id="structure" title="Project structure">
        <Content>
          Inside <C>apps/web/src</C>, each folder has one job. Put new code
          where its neighbours live.
        </Content>
        <Table
          head={['Folder', 'What goes there']}
          rows={[
            [
              <C key="a">app/</C>,
              'Routes. Pages are server components unless they need state or browser APIs.',
            ],
            [
              <C key="u">components/ui/</C>,
              'Shared building blocks: Button, ButtonIcon, Tooltip, Menu, Dialog parts, SegmentedControl, Chip and friends.',
            ],
            [
              <C key="c">components/…/</C>,
              'Feature components, grouped by area (dashboard, docs, recipes, roadmap).',
            ],
            [
              <C key="ac">actions/</C>,
              'Server actions, one per file, called from client components.',
            ],
            [
              <C key="acc">accessors/</C>,
              'Prisma queries. The only place that talks to the database.',
            ],
            [
              <C key="s">schemas/</C>,
              'Zod schemas, shared by forms and server actions.',
            ],
            [
              <C key="st">store/</C>,
              'Zustand stores for client state that several components share.',
            ],
            [
              <C key="h">hooks/</C>,
              'React hooks, such as useRepositories or useRecipeParam.',
            ],
            [
              <C key="ut">utils/</C>,
              'Pure functions with no React or database access, each with a test.',
            ],
            [
              <C key="cf">config/</C>,
              'Content as data: recipes, the roadmap, the docs navigation.',
            ],
            [
              <C key="r">rewards/</C>,
              'Turning GitHub events into Habitica scores.',
            ],
            [
              <C key="seo">seo/, json-ld/</C>,
              'Page metadata and structured data. Every new page is registered in seo/pageCatalog.ts.',
            ],
          ]}
        />
      </Section>

      <Section id="server-actions" title="Server actions and data">
        <List>
          <li>
            Wrap every server action in <C>runUserAction</C>. It checks the
            session, loads the GitHub user and shapes the result, so the client
            always gets <C>{'{ success, data, error }'}</C>.
          </li>
          <li>
            Validate input with <C>parseInput(schema, data)</C>, never trust
            what the browser sends.
          </li>
          <li>
            Throw <C>ActionError</C> for problems the user should read
            (&quot;Trigger not found.&quot;). Anything else is logged and shown
            as an unexpected error.
          </li>
          <li>
            Scope queries to the signed-in user in the accessor, so one user can
            never read or change another user&apos;s triggers.
          </li>
          <li>
            Never log, return or send secrets to the browser. Habitica API
            tokens are encrypted at rest and only decrypted on the server for a
            request.
          </li>
          <li>
            In client stores, track <C>isLoading</C> and <C>hasLoaded</C>{' '}
            separately: an empty state is only true once the first load has
            finished, and a component should only fetch when nothing has loaded
            or is loading yet.
          </li>
        </List>
      </Section>

      <Section id="ui" title="UI and the design system">
        <Content>
          The design language is described in the{' '}
          <Link
            href={githubRepositoryUrl(
              '/blob/main/docs/superpowers/specs/2026-10-23-design-language-2-design.md',
            )}
            target="_blank"
          >
            design spec
          </Link>
          . The short version:
        </Content>
        <List>
          <li>
            <strong>Use the semantic colour tokens</strong> (<C>bg-surface</C>,{' '}
            <C>text-text-2</C>, <C>border-border</C>, <C>bg-accent</C>,{' '}
            <C>text-hp</C>…). They switch between light and dark mode on their
            own. Tailwind&apos;s built-in palettes (slate, violet, red and so
            on) and <C>dark:</C> colour overrides fail <C>pnpm lint:tokens</C>.
          </li>
          <li>
            <strong>Wrap pages in Shell</strong> so every page shares the
            header&apos;s edges. Content pages open with <C>PageHeader</C>.
          </li>
          <li>
            <strong>Reuse components/ui</strong> before building something new.
            Icon-only buttons use <C>ButtonIcon</C> with a <C>label</C>, which
            becomes both the accessible name and the tooltip. Don&apos;t use{' '}
            <C>title</C> attributes.
          </li>
          <li>
            <strong>Grain is for magic.</strong> The <C>arcane</C> and{' '}
            <C>mist</C> gradients are for Habitica moments (hero, character
            sheet, roadmap, page headers), never for forms, tables or dialogs.
          </li>
          <li>
            <strong>Icons come from Hugeicons</strong>, the free stroke set
            only. No bulk, solid or two-tone variants.
          </li>
          <li>
            <strong>Write copy in sentence case</strong>, from the user&apos;s
            point of view, with buttons that say what they do (&quot;Add
            trigger&quot;, not &quot;Submit&quot;).
          </li>
          <li>
            <strong>Keep it accessible:</strong> real buttons and links, visible
            focus, labels on every control, and no motion beyond what{' '}
            <C>prefers-reduced-motion</C> allows.
          </li>
        </List>
      </Section>

      <Section id="testing" title="Testing">
        <List>
          <li>
            Tests live next to the code (<C>thing.test.ts</C> beside{' '}
            <C>thing.ts</C>) and run with Jest and Testing Library.
          </li>
          <li>
            Write the test first and watch it fail for the right reason. A test
            that passes before the change exists proves nothing.
          </li>
          <li>
            Put logic in pure functions in <C>utils/</C> and test them directly;
            keep components thin.
          </li>
          <li>
            When a component uses a store, mock the server action modules it
            imports (<C>jest.mock(&apos;@/actions/…&apos;)</C>). Importing a
            real action pulls in Prisma, which doesn&apos;t run in jsdom.
          </li>
          <li>
            There&apos;s no jest-dom: assert on DOM properties such as{' '}
            <C>classList</C>, <C>textContent</C> or attributes.
          </li>
          <li>
            Check what the first server render says with <C>renderToString</C>,
            so loading states never claim a list is empty.
          </li>
        </List>
        <Alert title="Some behaviour can't be tested in jsdom" variant="info">
          Native arrow-key handling in radio groups and focus returning after an
          animation need a real browser. Check those by hand and mention it in
          your pull request.
        </Alert>
      </Section>

      <Section id="commits" title="Commits and changelog">
        <Content>
          Commits follow Conventional Commits and feed the public changelog,
          which Habitica players read. The details are in{' '}
          <Link href="/docs/how-to-contribute">How to Contribute</Link>; the
          rules that matter most:
        </Content>
        <List>
          <li>
            <C>feat</C> and <C>fix</C> subjects describe what changes for the
            user, in plain English.
          </li>
          <li>
            Refactors are <C>refactor</C> commits, kept apart from fixes and
            features.
          </li>
          <li>
            Use the app as the scope (<C>feat(web): …</C>). Bigger changes land
            as one squash-merged pull request with one clear changelog entry.
          </li>
        </List>
      </Section>

      <Section id="database" title="Database changes">
        <Content>
          Change <C>apps/web/prisma/schema.prisma</C>, then create and commit a
          migration with your change:
        </Content>
        <Code
          code={[
            'pnpm --filter @octogriffin/web prisma:migrate:dev --name describe_your_change',
          ]}
          disableNumbers
          language="bash"
        />
        <Content>
          Migrations run automatically on deploy, so make sure they work on a
          database that already has data in it.
        </Content>
      </Section>

      <DocsFeedback />
    </div>
  );
}
