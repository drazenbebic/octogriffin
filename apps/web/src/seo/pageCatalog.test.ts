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

  it('dates sitemap entries by their last content change, not the build', () => {
    for (const { lastModified } of sitemapEntries()) {
      expect(lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it.each(pagePaths)(
    'gives %s a description, canonical address and link preview',
    page => {
      const metadata = pageMetadata(page);

      const url = new URL(page, 'https://octogriffin.com').toString();

      expect(metadata.description).toBeTruthy();
      expect(metadata.alternates?.canonical).toBe(url);
      expect(metadata.openGraph?.url).toBe(url);
    },
  );

  it.each(pagePaths)(
    'shows %s with the same title in search results and link previews',
    page => {
      const metadata = pageMetadata(page);
      const { absolute } = metadata.title as { absolute: string };

      expect(absolute).toMatch(/Octogriffin/);
      expect(metadata.openGraph?.title).toBe(absolute);
      expect(metadata.twitter?.title).toBe(absolute);
    },
  );
});
