<div align="center">
  <img src="apps/web/public/octogriffin_logo_square.png" alt="Octogriffin Logo" width="120" height="120" />
  <h1>Octogriffin</h1>
  <p>
    <strong>Turn your Commits into Gold and XP.</strong><br>
    Gamify your open-source work and professional development by connecting GitHub to Habitica.
  </p>

  <p>
    <a href="https://github.com/drazenbebic/habitica/actions/workflows/release-deploy.yaml">
      <img src="https://img.shields.io/github/actions/workflow/status/drazenbebic/habitica/release-deploy.yaml?branch=main" alt="Build Status">
    </a>
    <a href="LICENSE">
      <img src="https://img.shields.io/badge/License-AGPL%20v3-blue.svg" alt="License: AGPL v3">
    </a>
    <a href="https://twitter.com/drazenbebic">
      <img src="https://img.shields.io/twitter/follow/drazenbebic?style=social" alt="Follow on Twitter">
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

**Octogriffin** acts as a bridge between your GitHub workflow and your Habitica RPG character. Instead of manually checking off "Did code today" tasks, this application listens to GitHub webhooks and automatically rewards you based on the complexity and impact of your work.

It is built with **Next.js**, **Prisma**, and **PostgreSQL**.

## Features

- **Automated Rewards**:
  - **Push Commits**: Earn XP for every commit, up to 10 per push and trigger (configurable with `MAX_REWARDS_PER_EVENT`).
  - **Pull Requests**: Get a large XP boost for opening and merging PRs.
  - **Code Reviews**: Incentivize team collaboration by rewarding code reviews.
- **Bank-Grade Security**:
  - **AES-256 Encryption**: User API tokens are encrypted at rest.
  - **Webhook Verification**: Strictly verifies GitHub SHA-256 signatures to prevent spoofing.
- **Configurable**: Define your own difficulty multipliers (e.g., "Hard Mode" for legacy repos).
- **Open Source**: Licensed under AGPLv3.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database**: PostgreSQL (via Neon or Docker)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Encryption**: AES-256-GCM
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js / GitHub OAuth
- **Deployment**: Vercel

## Getting Started

### For Users

If you simply want to connect your repositories to Habitica, you do not need to clone this repo.
Follow our **[Installation Guide](https://octogriffin.com/installation)** to get started in minutes.

### For Developers

We have moved our technical setup instructions to our documentation portal.

To run the project locally (including Docker, Ngrok, and GitHub App configuration), please see the **[Developer Setup Guide](https://octogriffin.com/docs/dev-setup)**.

## Contributing

We welcome contributions! Please read our **[Contribution Guide](https://octogriffin.com/docs/how-to-contribute)** for details on our:

- Branching strategy
- Commit conventions (Conventional Commits)
- Pull Request process
- Design system standards

Please ensure you check the [Roadmap](https://octogriffin.com/roadmap) before starting large features.

## Sponsors

Octogriffin is an open-source passion project maintained by **Drazen Bebic** and contributors. While the core features will always remain free, server costs and development time are real.

[Be the first to sponsor! 🚀](https://github.com/sponsors/drazenbebic)

Your support helps keep the servers running and fuels new features.

- $2/mo: A sponsor badge on your profile.
- $5/mo: Get listed right here in this README.
- $15/mo: Get listed on the website & get priority feature requests.

Alternatively you can also support me on [Ko-fi](https://ko-fi.com/drazen).

## License

Distributed under the GNU Affero General Public License v3.0 (AGPL-3.0). See `LICENSE.md` for more information.

## Author

Drazen Bebic

- Website: [www.bebic.dev](https://www.bebic.dev)
- GitHub: [@drazenbebic](https://github.com/drazenbebic/)
