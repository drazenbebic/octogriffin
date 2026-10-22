import type { MetadataRoute } from 'next';

import { sitemapEntries } from '@/seo/pageCatalog';

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries();
}
