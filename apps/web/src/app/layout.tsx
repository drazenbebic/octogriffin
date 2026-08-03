import './globals.css';

import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React, { FC, ReactNode } from 'react';

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
  subsets: ['latin'],
  preload: true,
  fallback: ['sans-serif'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://octogriffin.com',
  ),
  title: {
    template: '%s | Octogriffin',
    default: 'Octogriffin',
  },
  description: 'Gamify your GitHub workflow with Habitica integration.',
  icons: {
    icon: [
      {
        url: '/octogriffin_logo_square.png',
        href: '/octogriffin_logo_square.png',
      },
    ],
  },
  openGraph: {
    siteName: 'Octogriffin',
    locale: 'en_US',
    type: 'website',
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
