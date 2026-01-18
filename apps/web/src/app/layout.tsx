import './globals.css';

import React, { FC, ReactNode } from 'react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import clsx from 'clsx';

import { ErrorListener } from '@/components/ErrorListener';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Providers } from '@/components/Providers';

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
  title: {
    template: '%s | Octogriffin',
    default: 'Octogriffin',
  },
  icons: {
    icon: [
      {
        url: '/octogriffin_logo_square.png',
        href: '/octogriffin_logo_square.png',
      },
    ],
  },
};

const RootLayout: FC<Props> = async ({ children }) => {
  return (
    <html lang="en">
      <body className={clsx(inter.className, 'flex min-h-screen flex-col')}>
        <Providers>
          <Header />
          <main id="content" className="flex-1 w-full">
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
