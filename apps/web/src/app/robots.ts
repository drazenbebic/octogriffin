import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://octogriffin.com';

  return {
    rules: {
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/profile/'],
      userAgent: '*',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
