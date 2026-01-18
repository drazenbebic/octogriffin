'use client';

import { signIn } from 'next-auth/react';

import { GithubIcon, SquareLock02Icon } from 'hugeicons-react';

import { Button } from '@/components/ui/Button';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';

export const AuthGate = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-50 text-slate-400 ring-1 ring-slate-100">
        <div className="absolute inset-0 rounded-3xl bg-slate-100/50 blur-xl"></div>
        <SquareLock02Icon size={48} />

        <div className="absolute -right-1 -top-1 h-6 w-6 rounded-full border-4 border-white bg-amber-500"></div>
      </div>

      <Heading level={1} size="3xl" className="mb-4">
        Restricted Area
      </Heading>

      <Content size="lg" className="mb-8 max-w-md">
        This mission control center is for registered adventurers only. Identify
        yourself to access your configurations.
      </Content>

      <Button
        size="lg"
        onClick={() => signIn('github', { callbackUrl: window.location.href })}
        className="shadow-xl shadow-violet-600/20 transition-transform active:scale-95"
      >
        <GithubIcon size={20} className="mr-2" />
        Access with GitHub
      </Button>
    </div>
  );
};
