import type { Metadata } from 'next';

type Params = {
  description: string;
  path: string;
  suffix?: string;
  title: string;
};

export const generatePageMetadata = ({
  description,
  path = '',
  suffix = 'Octogriffin',
  title,
}: Params): Metadata => {
  const imageUrl = 'https://octogriffin.com/og-image.png';

  return {
    description,
    openGraph: {
      description,
      images: [
        {
          alt: 'Octogriffin logo',
          height: 630,
          url: imageUrl,
          width: 1200,
        },
      ],
      locale: 'en_US',
      siteName: 'Octogriffin',
      title: `${title} - ${suffix}`,
      type: 'website',
      url: `https://octogriffin.com/${path}`,
    },
    title,
    twitter: {
      card: 'summary_large_image',
      description,
      images: [imageUrl],
      title: `${title} - ${suffix}`,
    },
  };
};
