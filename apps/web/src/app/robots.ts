import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/seo/pageCatalog';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/profile/'],
      userAgent: '*',
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
