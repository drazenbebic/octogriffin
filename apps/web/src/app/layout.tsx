import './globals.css';

import type { Metadata } from 'next';
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from 'next/font/google';
import type { FC, ReactNode } from 'react';
import React from 'react';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { ErrorListener } from '@/components/ErrorListener';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Providers } from '@/components/Providers';
import { siteUrl } from '@/seo/pageCatalog';
import { cn } from '@/utils/cn';

type Props = {
  children: ReactNode;
};

const bricolage = Bricolage_Grotesque({
  axes: ['opsz'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-bricolage',
});

const inter = Inter({
  display: 'swap',
  fallback: ['sans-serif'],
  preload: true,
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  description: 'Gamify your GitHub workflow with Habitica integration.',
  icons: {
    icon: [
      {
        href: '/octogriffin_logo_square.png',
        url: '/octogriffin_logo_square.png',
      },
    ],
  },
  metadataBase: siteUrl,
  openGraph: {
    locale: 'en_US',
    siteName: 'Octogriffin',
    type: 'website',
  },
  title: {
    default: 'Octogriffin',
    template: '%s | Octogriffin',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

// Keep this async: as a sync layout, the footer's links reach the client
// tooltips as lazy elements, and Ariakit's render prop then crashes
const RootLayout: FC<Props> = async ({ children }) => {
  return (
    <html
      className={cn(bricolage.variable, inter.variable, jetbrainsMono.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-bg font-sans text-text antialiased">
        <Providers>
          <Header />
          <main className="flex-1 w-full" id="content">
            {children}
          </main>
          <Footer />
        </Providers>
        <ErrorListener />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
