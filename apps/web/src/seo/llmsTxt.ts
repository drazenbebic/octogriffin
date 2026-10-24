import { pageInfo, type PagePath, pagePaths, pageUrl } from './pageCatalog';

const legalPaths: PagePath[] = [
  '/imprint',
  '/privacy-policy',
  '/terms-and-conditions',
];

const link = (path: PagePath, title = pageInfo(path).title) =>
  `- [${title}](${pageUrl(path)}): ${pageInfo(path).description}`;

const section = (heading: string, lines: string[]) =>
  [`## ${heading}`, '', ...lines].join('\n');

/**
 * The site as an llms.txt file (https://llmstxt.org): a short summary for
 * language models, then every public page from the catalog with its
 * description. Legal pages go under "Optional", which tools may skip.
 */
export const buildLlmsTxt = () => {
  const docs = pagePaths.filter(path => pageInfo(path).isDocs);
  const pages = pagePaths.filter(
    path =>
      path !== '/' && !pageInfo(path).isDocs && !legalPaths.includes(path),
  );

  return [
    '# Octogriffin',
    `> ${pageInfo('/').description}`,
    'Octogriffin is a GitHub App. You install it on your repositories, add your Habitica User ID and API Token, and create triggers: each trigger links a GitHub event (a push, a merged pull request, a submitted review, a published release and so on) to a Habitica habit that gets scored when the event arrives. Recipes are ready-made triggers for common coding habits.',
    section(
      'Docs',
      docs.map(path => link(path)),
    ),
    section(
      'Pages',
      pages.map(path =>
        path === '/docs' ? link(path, 'Documentation') : link(path),
      ),
    ),
    section(
      'Optional',
      legalPaths.map(path => link(path)),
    ),
  ]
    .join('\n\n')
    .concat('\n');
};
