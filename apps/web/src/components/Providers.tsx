'use client';

import { FC, ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

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
              toast:
                'group !bg-white dark:!bg-slate-900 !border-slate-200 dark:!border-slate-800 !shadow-xl !shadow-violet-900/5 !rounded-2xl !p-4 gap-3',
              title:
                '!text-slate-900 dark:!text-slate-50 !font-semibold !text-sm',
              description: '!text-slate-500 dark:!text-slate-400 !text-sm',
              actionButton:
                '!bg-violet-600 !text-white !font-medium !rounded-lg',
              cancelButton:
                '!bg-slate-100 dark:!bg-slate-800 !text-slate-600 dark:!text-slate-400 !font-medium !rounded-lg',
              error:
                '!text-red-600 !border-red-100 dark:!border-red-900/50 !bg-red-50/50 dark:!bg-red-900/10',
              success:
                '!text-emerald-600 !border-emerald-100 dark:!border-emerald-900/50 !bg-emerald-50/50 dark:!bg-emerald-900/10',
              warning:
                '!text-amber-600 !border-amber-100 dark:!border-amber-900/50 !bg-amber-50/50 dark:!bg-amber-900/10',
              info: '!text-blue-600 !border-blue-100 dark:!border-blue-900/50 !bg-blue-50/50 dark:!bg-blue-900/10',
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
};
