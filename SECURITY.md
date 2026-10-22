# Security Policy

Octogriffin stores Habitica API tokens and receives webhooks from GitHub, so we take security seriously. Thank you for helping keep it and its users safe.

## Supported Versions

Octogriffin is a hosted service. Only the version running on [octogriffin.com](https://octogriffin.com), which is built from the latest `main` branch, receives security fixes. If you self-host, please keep your deployment up to date with `main`.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues, discussions or pull requests.**

Report them privately instead:

- **Preferred**: [Open a private security advisory](https://github.com/drazenbebic/octogriffin/security/advisories/new) on GitHub.
- **Alternative**: Email [drazen.bebic@outlook.com](mailto:drazen.bebic@outlook.com) with the subject `[Octogriffin Security]`.

Please include as much of the following as you can:

- The type of issue (for example authentication bypass, token disclosure, webhook spoofing)
- The affected URL, endpoint or file path
- Step-by-step instructions to reproduce the issue
- A proof of concept, if you have one
- The impact you believe the issue has and how an attacker could exploit it

## What to Expect

Octogriffin is maintained in spare time, but security reports always come first.

- We confirm that we received your report within **3 business days**.
- We send you an initial assessment within **7 days**.
- We keep you updated while we work on a fix and let you know when it is released.
- With your permission, we credit you in the security advisory once the issue is fixed.

There is no paid bug bounty program at this time.

## Scope

In scope:

- The Octogriffin web app and API on `octogriffin.com`
- The GitHub webhook endpoint and its signature verification
- Authentication and access to other users' accounts, triggers or history
- Storage and handling of Habitica API tokens
- The source code in this repository

Out of scope:

- Vulnerabilities in GitHub, Habitica, Vercel or other third-party services (please report those to the vendor)
- Denial of service, load testing or spam
- Social engineering or phishing
- Reports from automated scanners without a demonstrated impact
- Missing security headers or best practices without a concrete exploit

## Safe Harbor

We will not pursue legal action against anyone who, in good faith:

- Only tests against their own accounts and data
- Does not access, change or delete other users' data
- Does not degrade the service for others
- Gives us reasonable time to fix the issue before disclosing it publicly

If in doubt, ask us first at the address above.
