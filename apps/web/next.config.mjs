import bundleAnalyzer from '@next/bundle-analyzer';

import packageJson from './package.json' with { type: 'json' };

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
  experimental: {
    esmExternals: true,
    inlineCss: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75],
    remotePatterns: [
      {
        hostname: '*.googleusercontent.com',
        protocol: 'https',
      },
      {
        hostname: '*.githubusercontent.com',
        protocol: 'https',
      },
    ],
  },
  transpilePackages: ['@ariakit/react'],
};

export default withBundleAnalyzer(nextConfig);
