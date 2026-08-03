'use client';

import { signIn } from 'next-auth/react';

import { GithubIcon, SquareLock02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/Button';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';

export const AuthGate = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-50 text-slate-400 ring-1 ring-slate-100 dark:bg-slate-900 dark:text-slate-500 dark:ring-slate-800">
        <div className="absolute inset-0 rounded-3xl bg-slate-100/50 blur-xl dark:bg-slate-800/50" />
        <HugeiconsIcon icon={SquareLock02Icon} size={48} />

        <div className="absolute -right-1 -top-1 h-6 w-6 rounded-full border-4 border-white bg-amber-500 dark:border-slate-950" />
      </div>

      <Heading className="mb-4" level={1} size="3xl">
        Restricted Area
      </Heading>

      <Content className="mb-8 max-w-md" size="lg">
        This mission control center is for registered adventurers only. Identify
        yourself to access your configurations.
      </Content>

      <Button
        className="shadow-xl shadow-violet-600/20 transition-transform active:scale-95"
        onClick={() => signIn('github', { callbackUrl: window.location.href })}
        size="lg"
      >
        <HugeiconsIcon className="mr-2" icon={GithubIcon} size={20} />
        Access with GitHub
      </Button>
    </div>
  );
};
