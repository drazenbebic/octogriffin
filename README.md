<div align="center">
  <img src="apps/web/public/octogriffin_logo_square.png" alt="Octogriffin Logo" width="120" height="120" />
  <h1>Octogriffin</h1>
  <p>
    <strong>Turn your Commits into Gold and XP.</strong><br>
    Gamify your open-source work and professional development by connecting GitHub to Habitica.
  </p>

  <p>
    <a href="https://github.com/drazenbebic/octogriffin/actions/workflows/ci.yaml">
      <img src="https://img.shields.io/github/actions/workflow/status/drazenbebic/octogriffin/ci.yaml?branch=main&label=CI" alt="CI Status">
    </a>
    <a href="https://github.com/drazenbebic/octogriffin/actions/workflows/release-deploy.yaml">
      <img src="https://img.shields.io/github/actions/workflow/status/drazenbebic/octogriffin/release-deploy.yaml?branch=main&label=deploy" alt="Deploy Status">
    </a>
    <a href="LICENSE">
      <img src="https://img.shields.io/badge/License-AGPL%20v3-blue.svg" alt="License: AGPL v3">
    </a>
  </p>

  <p>
    <a href="https://octogriffin.com/installation"><strong>Installation Guide</strong></a> •
    <a href="https://octogriffin.com/docs"><strong>Documentation</strong></a> •
    <a href="https://octogriffin.com/roadmap"><strong>Roadmap</strong></a>
  </p>
</div>

---

## About

**Octogriffin** acts as a bridge between your GitHub workflow and your Habitica RPG character. Instead of manually checking off "Did code today" tasks, it listens to GitHub webhooks and scores Habitica habits for you whenever you push, open a pull request, review code and more.

It is built with **Next.js**, **Prisma** and **PostgreSQL**, and runs as a GitHub App.

## Features

- **Triggers you define**: Pick a GitHub event and the Habitica habit it should score. Commits, pull requests, reviews, issues, releases, stars and [many more events](https://octogriffin.com/docs/supported-github-events) are supported.
- **Your rules**:
  - **Difficulty**: Trivial, Easy, Medium or Hard.
  - **Direction**: Earn XP and Gold, or lose Health for habits you want to break.
  - **Scope**: Apply a trigger to all your repositories or only to selected ones.
- **Fair rewards**: A trigger scores at most 10 times per event (for example a push with 50 commits). Self-hosters can change this with `MAX_REWARDS_PER_EVENT`. Triggers can also have a cooldown, from seconds up to 365 days, so they rest for a while after they score. A daily cap sets the most a trigger can score in a Habitica day. Skip spam, on by default, leaves out empty commits and pull requests closed straight away. Bots like Dependabot never earn rewards.
- **Security first**:
  - **AES-256-GCM encryption**: Your Habitica API token is encrypted at rest and never sent to the browser.
  - **Webhook verification**: Every GitHub delivery is checked against its SHA-256 signature.
- **Open source**: Licensed under AGPLv3.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router), React 19
- **Database**: PostgreSQL (Neon in production, Docker locally)
- **ORM**: [Prisma 7](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with GitHub OAuth
- **Styling**: Tailwind CSS 4, Ariakit, Hugeicons
- **Testing**: Jest, Testing Library
- **Tooling**: pnpm workspaces, ESLint, Prettier, Husky, commitlint
- **Releases**: [Release Please](https://github.com/googleapis/release-please), deployed to Vercel

## Getting Started

### For Users

If you simply want to connect your repositories to Habitica, you do not need to clone this repo.
Follow our **[Installation Guide](https://octogriffin.com/installation)** to get started in minutes.

### For Developers

You need Node.js 22 or newer (CI uses 24), pnpm (the version is pinned in `package.json`, `corepack enable` picks it up) and Docker.

```bash
git clone https://github.com/drazenbebic/octogriffin.git
cd octogriffin
pnpm install

# Start PostgreSQL (and pgAdmin on http://localhost:5050)
cp .env.example .env
docker compose up -d

# Configure the web app, then fill in the values
cp apps/web/.env.local.example apps/web/.env

# Create the database tables and start the dev server
pnpm --filter @octogriffin/web prisma:migrate:dev
pnpm dev
```

The app runs on [http://localhost:3000](http://localhost:3000). To receive webhooks you also need your own GitHub App and a public tunnel to your machine. The **[Developer Setup Guide](https://octogriffin.com/docs/dev-setup)** walks you through both, and the **[Architecture overview](https://octogriffin.com/docs/architecture)** explains how the pieces fit together.

| Command      | What it does                                       |
| ------------ | -------------------------------------------------- |
| `pnpm dev`   | Start the dev servers                              |
| `pnpm lint`  | Run ESLint                                         |
| `pnpm test`  | Run the Jest test suites                           |
| `pnpm build` | Build every app (runs database migrations as well) |
| `pnpm knip`  | Find unused files, exports and dependencies        |

### Repository Layout

```
apps/
  web/   Next.js app: website, docs, dashboard and the GitHub webhook endpoint
  api/   Standalone API (Hono), early stage
```

## Contributing

We welcome contributions! Please read **[CONTRIBUTING.md](CONTRIBUTING.md)** before opening a pull request. It covers:

- Finding something to work on
- Branch names and commit conventions (Conventional Commits)
- Checks that must pass
- The pull request process

Please check the [Roadmap](https://octogriffin.com/roadmap) and open an issue before starting large features.

## Security

Found a vulnerability? Please **do not** open a public issue. See **[SECURITY.md](SECURITY.md)** for how to report it privately.

## Sponsors

Octogriffin is an open-source passion project maintained by **Drazen Bebic** and contributors. While the core features will always remain free, server costs and development time are real.

Your support helps keep the servers running and fuels new features. Every monthly sponsor is listed here and on [the website](https://octogriffin.com/sponsors); the tier decides how big:

- $2/mo, Coffee fund: your name.
- $5/mo, Server fuel: your avatar and name.
- $15/mo, Feature backer: a large avatar and link at the top, plus priority on your feature requests.

Sponsor monthly or give once on [GitHub Sponsors](https://github.com/sponsors/drazenbebic) or [Ko-fi](https://ko-fi.com/drazen). Public one-time gifts from the last 12 months are listed as Potion brewers.

### The party

[Be the first to sponsor! 🚀](https://github.com/sponsors/drazenbebic)

### Potion brewers

- [Sofie](https://ko-fi.com/Y8Y61WWFJP)

## License

Distributed under the GNU Affero General Public License v3.0 (AGPL-3.0). See [`LICENSE`](LICENSE) for more information.

## Author

Drazen Bebic

- Website: [www.bebic.dev](https://www.bebic.dev)
- X: [@drazenbebic](https://x.com/drazenbebic)
- LinkedIn: [Drazen Bebic](https://www.linkedin.com/in/drazenbebic/)
