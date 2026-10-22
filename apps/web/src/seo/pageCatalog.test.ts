import { readdirSync } from 'node:fs';
import path from 'node:path';

import { pageMetadata, pagePaths, sitemapEntries } from './pageCatalog';

const appDir = path.join(__dirname, '..', 'app');

// Signed-in areas are kept out of search engines by robots.txt.
const privateRoutes = ['/dashboard', '/profile'];

const publicRoutes = () =>
  readdirSync(appDir, { recursive: true })
    .map(String)
    .filter(file => path.basename(file) === 'page.tsx')
    .map(file => {
      const segments = path
        .dirname(file)
        .split(path.sep)
        .filter(segment => segment !== '.' && !segment.startsWith('@'));

      return `/${segments.join('/')}`;
    })
    .filter(
      route =>
        !privateRoutes.some(
          privateRoute =>
            route === privateRoute || route.startsWith(`${privateRoute}/`),
        ),
    );

describe('pageCatalog', () => {
  it('lists every public page and nothing else', () => {
    expect([...new Set(publicRoutes())].sort()).toEqual([...pagePaths].sort());
  });

  it('puts every page in the sitemap', () => {
    expect(sitemapEntries().map(({ url }) => new URL(url).pathname)).toEqual(
      pagePaths,
    );
  });

  it.each(pagePaths)('gives %s a description and link preview', page => {
    const metadata = pageMetadata(page);

    expect(metadata.description).toBeTruthy();
    expect(metadata.openGraph?.url).toBe(
      new URL(page, 'https://octogriffin.com').toString(),
    );
  });
});
