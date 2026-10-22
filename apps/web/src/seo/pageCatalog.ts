import type { Metadata, MetadataRoute } from 'next';

type Page = {
  description: string;
  /** Docs pages carry the "Octogriffin Docs" suffix in their titles. */
  isDocs?: boolean;
  title: string;
  /** When the page's content last changed, as YYYY-MM-DD. */
  updatedAt: string;
};

/**
 * Every public page and what search engines and link previews should know
 * about it. Metadata, the sitemap and structured data are all derived from
 * here, so a new public page only needs an entry in this list.
 */
const pages = {
  '/': {
    description:
      'Octogriffin is a free, open-source Habitica GitHub integration. Earn XP and Gold in Habitica for your commits, pull requests, and code reviews, automatically.',
    title: 'Habitica GitHub Integration: XP for Commits & PRs – Octogriffin',
    updatedAt: '2026-10-22',
  },
  '/docs': {
    description:
      'The complete guide to Octogriffin. Explore documentation for installation, configuration, architecture, and contributing to the open-source codebase.',
    title: 'Octogriffin Docs: Habitica GitHub Integration Guides',
    updatedAt: '2026-10-22',
  },
  '/docs/architecture': {
    description:
      'High-level overview of the Octogriffin technology stack, data flow, and security model.',
    isDocs: true,
    title: 'Architecture',
    updatedAt: '2026-03-23',
  },
  '/docs/coding-habits': {
    description:
      'Ready-made Octogriffin triggers that turn commits, pull requests, code reviews and releases into Habitica habits, plus tips for rewards and streaks.',
    isDocs: true,
    title: 'Build Coding Habits in Habitica with GitHub',
    updatedAt: '2026-10-22',
  },
  '/docs/dev-setup': {
    description:
      'Complete guide to setting up Octogriffin locally. Learn how to configure Docker, create a GitHub App, and initialize the database for development.',
    isDocs: true,
    title: 'Development Setup',
    updatedAt: '2026-03-25',
  },
  '/docs/habitica-api-token': {
    description:
      'Where to find your Habitica User ID and API Token, and how to add them to Octogriffin so your GitHub activity earns XP and Gold.',
    isDocs: true,
    title: 'Find Your Habitica User ID and API Token',
    updatedAt: '2026-10-22',
  },
  '/docs/how-to-contribute': {
    description:
      'Guidelines for contributing to Octogriffin. Learn about our branching strategy, commit conventions, and pull request process.',
    isDocs: true,
    title: 'How to Contribute',
    updatedAt: '2026-03-25',
  },
  '/docs/setting-up-ngrok': {
    description:
      'How to expose your local development environment to GitHub webhooks using Ngrok.',
    isDocs: true,
    title: 'Setting up Ngrok',
    updatedAt: '2026-03-25',
  },
  '/docs/supported-github-events': {
    description:
      'Every GitHub event Octogriffin can turn into Habitica XP and Gold: pushes, pull requests, reviews, issues, releases, discussions, workflows and more.',
    isDocs: true,
    title: 'Supported GitHub Events',
    updatedAt: '2026-10-22',
  },
  '/faq': {
    description:
      'Answers about connecting GitHub to Habitica with Octogriffin: what it costs, how rewards work, and how your API Token and code stay safe.',
    title: 'Habitica GitHub Integration FAQ',
    updatedAt: '2026-10-22',
  },
  '/imprint': {
    description:
      'Legal disclosure and provider identification for Octogriffin. Operated by Drazen Bebic in Vienna, Austria.',
    title: 'Imprint',
    updatedAt: '2026-03-25',
  },
  '/installation': {
    description:
      'Connect GitHub to Habitica in four steps: install the Octogriffin GitHub App, pick your repositories, add your Habitica API Token, and choose which events earn rewards.',
    title: 'How to Connect GitHub to Habitica',
    updatedAt: '2026-10-22',
  },
  '/privacy-policy': {
    description:
      'We protect your code and data. Learn about our GDPR compliance, zero-storage policy for source code, and secure infrastructure in Frankfurt.',
    title: 'Privacy Policy',
    updatedAt: '2026-10-22',
  },
  '/roadmap': {
    description: 'Our development plan for the future of Octogriffin.',
    title: 'Roadmap',
    updatedAt: '2026-03-25',
  },
  '/sponsors': {
    description:
      'Support the development of Octogriffin and keep the servers running.',
    title: 'Sponsors',
    updatedAt: '2026-03-25',
  },
  '/terms-and-conditions': {
    description:
      'User agreement, usage guidelines, and liability disclaimers for the Octogriffin GitHub integration.',
    title: 'Terms & Conditions',
    updatedAt: '2026-01-12',
  },
} satisfies Record<string, Page>;

export type PagePath = keyof typeof pages;

export const pagePaths = Object.keys(pages) as PagePath[];

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_APP_URL || 'https://octogriffin.com',
);

export const absoluteUrl = (path: string) => new URL(path, siteUrl).toString();

export const pageUrl = (path: PagePath) => absoluteUrl(path);

export const ogImageUrl = absoluteUrl('/og-image.png');

/**
 * The title shown in search results, browser tabs and link previews alike.
 * Titles that already name Octogriffin get no suffix.
 */
const fullTitle = (path: PagePath) => {
  const { isDocs, title }: Page = pages[path];

  if (title.includes('Octogriffin')) {
    return title;
  }

  return `${title} | ${isDocs ? 'Octogriffin Docs' : 'Octogriffin'}`;
};

export const pageMetadata = (path: PagePath): Metadata => {
  const { description }: Page = pages[path];
  const title = fullTitle(path);

  return {
    alternates: {
      canonical: pageUrl(path),
    },
    description,
    openGraph: {
      description,
      images: [
        {
          alt: 'Octogriffin logo',
          height: 630,
          url: ogImageUrl,
          width: 1200,
        },
      ],
      locale: 'en_US',
      siteName: 'Octogriffin',
      title,
      type: 'website',
      url: pageUrl(path),
    },
    title: { absolute: title },
    twitter: {
      card: 'summary_large_image',
      description,
      images: [ogImageUrl],
      title,
    },
  };
};

export const sitemapEntries = (): MetadataRoute.Sitemap =>
  pagePaths.map(path => ({
    changeFrequency: 'monthly',
    lastModified: pages[path].updatedAt,
    priority: path === '/' ? 1 : 0.3,
    url: pageUrl(path),
  }));
