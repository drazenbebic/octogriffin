import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { FC, ReactNode } from 'react';
import React from 'react';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { ErrorListener } from '@/components/ErrorListener';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Providers } from '@/components/Providers';
import { cn } from '@/utils/cn';

type Props = {
  children: ReactNode;
};

const inter = Inter({
  display: 'swap',
  fallback: ['sans-serif'],
  preload: true,
  subsets: ['latin'],
  variable: '--font-heading',
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://octogriffin.com',
  ),
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

const RootLayout: FC<Props> = async ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          'flex min-h-screen flex-col bg-white text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-50',
        )}
      >
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
