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
      'Level up your RPG character automatically while you code. Connect GitHub to Habitica and turn commits, PRs, and reviews into XP, Gold, and Loot.',
    title: 'Octogriffin - Gamify Your GitHub Workflow',
    updatedAt: '2026-03-25',
  },
  '/docs': {
    description:
      'The complete guide to Octogriffin. Explore documentation for installation, configuration, architecture, and contributing to the open-source codebase.',
    isDocs: true,
    title: 'Introduction',
    updatedAt: '2026-05-31',
  },
  '/docs/architecture': {
    description:
      'High-level overview of the Octogriffin technology stack, data flow, and security model.',
    isDocs: true,
    title: 'Architecture',
    updatedAt: '2026-03-23',
  },
  '/docs/dev-setup': {
    description:
      'Complete guide to setting up Octogriffin locally. Learn how to configure Docker, create a GitHub App, and initialize the database for development.',
    isDocs: true,
    title: 'Development Setup',
    updatedAt: '2026-03-25',
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
  '/faq': {
    description:
      'Common questions about how Octogriffin processes your GitHub activity and rewards you.',
    title: 'FAQs',
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
      'Get up and running in minutes. Follow our step-by-step guide to install the GitHub App, configure permissions, and link your Habitica account.',
    title: 'Installation',
    updatedAt: '2026-03-25',
  },
  '/privacy-policy': {
    description:
      'We protect your code and data. Learn about our GDPR compliance, zero-storage policy for source code, and secure infrastructure in Frankfurt.',
    title: 'Privacy Policy',
    updatedAt: '2026-01-12',
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

export const pageMetadata = (path: PagePath): Metadata => {
  const { description, isDocs, title }: Page = pages[path];
  const socialTitle =
    path === '/'
      ? title
      : `${title} - ${isDocs ? 'Octogriffin Docs' : 'Octogriffin'}`;

  return {
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
      title: socialTitle,
      type: 'website',
      url: pageUrl(path),
    },
    title,
    twitter: {
      card: 'summary_large_image',
      description,
      images: [ogImageUrl],
      title: socialTitle,
    },
  };
};

export const sitemapEntries = (): MetadataRoute.Sitemap =>
  pagePaths.map(path => ({
    changeFrequency: 'monthly',
    lastModified: new Date(),
    priority: path === '/' ? 1 : 0.3,
    url: pageUrl(path),
  }));
