# Contributing to Octogriffin

Thanks for taking the time to contribute! Whether you are fixing a typo, improving the UI or adding support for a new GitHub event, this guide will help you get your change merged.

## Ground Rules

- Be kind and respectful. We are all here to have fun building something useful.
- Security issues are **never** reported in public issues. See [SECURITY.md](SECURITY.md).
- By contributing, you agree that your contributions are licensed under the [AGPL-3.0](LICENSE), the same license as the project.

## Finding Something to Work On

- Browse the [open issues](https://github.com/drazenbebic/octogriffin/issues). Issues labeled **good first issue** or **help wanted** are a great place to start.
- Check the [milestones](https://github.com/drazenbebic/octogriffin/milestones) and the [roadmap](https://octogriffin.com/roadmap) to see what is prioritized.
- For anything bigger than a small fix, **open an issue first** (or comment on an existing one) so we can agree on the approach before you invest time in it.
- Questions and ideas are welcome in [Discussions](https://github.com/drazenbebic/octogriffin/discussions).

## Setting Up Your Environment

1. [Fork the repository](https://github.com/drazenbebic/octogriffin/fork) and clone your fork:

   ```bash
   git clone https://github.com/YOUR_USERNAME/octogriffin.git
   cd octogriffin
   pnpm install
   ```

2. Follow the quick start in the [README](README.md#for-developers) to start the database and the dev server.
3. To test webhooks end to end, follow the [Developer Setup Guide](https://octogriffin.com/docs/dev-setup) to create your own GitHub App and a tunnel with [ngrok](https://octogriffin.com/docs/setting-up-ngrok).

`pnpm install` also sets up the Git hooks (via Husky):

| Hook         | What it runs                                |
| ------------ | ------------------------------------------- |
| `pre-commit` | ESLint and Prettier on the files you staged |
| `commit-msg` | commitlint, to check your commit message    |
| `pre-push`   | `pnpm lint`, `pnpm test` and `pnpm build`   |

## Making Changes

### Branches

Create a branch from `main` for your work. Do not commit directly to `main`, not even on your fork.

- `feature/add-new-trigger` for new features
- `fix/auth-redirect-bug` for bug fixes
- `docs/…`, `refactor/…`, `chore/…` for everything else

Keep each branch focused on one change. Small pull requests get reviewed and merged much faster than big ones.

### Commit Messages

We use [Release Please](https://github.com/googleapis/release-please) to version the apps and write the changelogs, so commit messages **must** follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
```

- **Types**: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`
- **Scopes**: `web` or `api` for changes inside an app; leave it out for repository-wide changes (for example `ci: …`).

`feat` and `fix` commits end up in the public changelog, which is read by Habitica players, not only developers. Write their subjects in plain English and describe what changes for the user:

| ✅ Good                                                             | ❌ Avoid                                      |
| ------------------------------------------------------------------- | --------------------------------------------- |
| `fix(web): retry when Habitica is busy instead of dropping rewards` | `fix(web): handle 429 in HabiticaApi.request` |
| `feat(web): add ready-made recipes for building coding habits`      | `feat: recipes page + json-ld`                |

Code changes that do not change behavior (renames, moving code around, cleanups) are `refactor` commits. Keep them separate from fixes and features so the changelog stays readable.

A breaking change gets a `!` after the type, for example `feat(web)!: drop support for the v1 webhook endpoint`.

### Code Style

- ESLint and Prettier are the source of truth. The pre-commit hook fixes most issues for you.
- Write TypeScript. `pnpm --filter @octogriffin/web exec tsc --noEmit` must pass.
- Reuse the components in `apps/web/src/components/ui` instead of building new ones. Use Tailwind classes for colors rather than hard-coded values, so light and dark mode keep working.
- Icons come from **Hugeicons** (free set, stroke style only).
- Never log, return or send secrets such as the Habitica API token to the browser. Tokens are stored encrypted (`apps/web/src/lib/crypto.ts`).

### Tests

Add or update tests for the behavior you change. Tests live next to the code they test (`*.test.ts` / `*.test.tsx`) and run with Jest:

```bash
pnpm test
```

### Database Changes

If you change `apps/web/prisma/schema.prisma`, create a migration and commit it with your change:

```bash
pnpm --filter @octogriffin/web prisma:migrate:dev --name describe_your_change
```

Migrations run automatically on deploy, so make sure they work on a database that already has data in it.

## Opening a Pull Request

1. Run the same checks CI runs:

   ```bash
   pnpm lint
   pnpm --filter @octogriffin/web exec tsc --noEmit
   pnpm test
   pnpm build
   ```

2. Push your branch to your fork and open a pull request against `main`.
3. Give the pull request a **Conventional Commits title** (for example `fix(web): keep the triggers list on screen while saving`). A check enforces this, and the title becomes the commit message when the pull request is squash-merged.
4. Fill in the pull request template. Link the issue it resolves (`Closes #123`) and add screenshots or a short video for UI changes.

A maintainer will review your pull request. Please be patient: Octogriffin is maintained in spare time. Once approved, it is merged and released with the next Release Please release.

## Reporting Bugs and Requesting Features

Use the [issue templates](https://github.com/drazenbebic/octogriffin/issues/new/choose). For bugs, include the steps to reproduce, what you expected and what happened instead. Leave out your Habitica API token and any other secrets.

Thanks again for contributing! 🐙🦅
