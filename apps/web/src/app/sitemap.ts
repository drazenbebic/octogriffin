import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://octogriffin.com';

  return [
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 1,
      url: baseUrl,
    },
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 0.3,
      url: `${baseUrl}/docs`,
    },
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 0.3,
      url: `${baseUrl}/docs/architecture`,
    },
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 0.3,
      url: `${baseUrl}/docs/dev-setup`,
    },
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 0.3,
      url: `${baseUrl}/docs/how-to-contribute`,
    },
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 0.3,
      url: `${baseUrl}/docs/setting-up-ngrok`,
    },
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 0.3,
      url: `${baseUrl}/faq`,
    },
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 0.3,
      url: `${baseUrl}/imprint`,
    },
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 0.3,
      url: `${baseUrl}/installation`,
    },
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 0.3,
      url: `${baseUrl}/privacy-policy`,
    },
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 0.3,
      url: `${baseUrl}/roadmap`,
    },
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 0.3,
      url: `${baseUrl}/sponsors`,
    },
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 0.3,
      url: `${baseUrl}/terms-and-conditions`,
    },
  ];
}
