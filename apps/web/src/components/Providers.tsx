'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import type { FC, ReactNode } from 'react';

import { Toaster } from 'sonner';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              actionButton: '!bg-accent !text-white !font-semibold !rounded-md',
              cancelButton: '!bg-fill !text-text-2 !font-semibold !rounded-md',
              description: '!text-text-2 !text-[13px]',
              error: '[&_[data-icon]]:!text-hp',
              info: '[&_[data-icon]]:!text-mp',
              // The reward strip: success toasts get a thin grain-coloured bar
              success:
                'before:!absolute before:!inset-x-0 before:!top-0 before:!h-1 before:!bg-[linear-gradient(90deg,#7853be,#432879_60%,#f5b544)] [&_[data-icon]]:!text-ok',
              title: '!text-text !font-semibold !text-[13px]',
              toast:
                'group !overflow-hidden !bg-raised !border-border !text-text !shadow-e2 !rounded-md !p-4 gap-3',
              warning: '[&_[data-icon]]:!text-xp',
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
};
