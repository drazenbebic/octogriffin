import { execSync } from 'node:child_process';

import bundleAnalyzer from '@next/bundle-analyzer';

import packageJson from './package.json' with { type: 'json' };

// Vercel provides the deployed commit; local builds ask git
const commitSha = (() => {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA;
  }

  try {
    return execSync('git rev-parse HEAD', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return '';
  }
})();

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
    NEXT_PUBLIC_COMMIT_SHA: commitSha,
  },
  experimental: {
    esmExternals: true,
    inlineCss: true,
  },
  async headers() {
    return [
      {
        headers: [
          // Other sites can't show Octogriffin in a frame and trick people
          // into clicking something
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
        source: '/:path*',
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75],
    // GitHub profile pictures are the only images from elsewhere
    remotePatterns: [
      {
        hostname: 'avatars.githubusercontent.com',
        protocol: 'https',
      },
    ],
  },
  transpilePackages: ['@ariakit/react'],
};

export default withBundleAnalyzer(nextConfig);
