'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { FC } from 'react';

import {
  DashboardSquare02Icon,
  GithubIcon,
  Logout04Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ButtonIcon } from '@/components/ui/ButtonIcon';

export const UserMenu: FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-1.5 animate-pulse">
        <div className="h-9 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Button
        onClick={() => signIn('github', { callbackUrl: window.location.href })}
        size="sm"
      >
        <HugeiconsIcon className="mr-2" icon={GithubIcon} size={18} />
        Sign In
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Link href="/dashboard" title="Go to Dashboard">
        <div className="group flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-violet-400">
          <HugeiconsIcon
            className="text-slate-400 transition-colors group-hover:text-violet-600 dark:text-slate-500 dark:group-hover:text-violet-400"
            icon={DashboardSquare02Icon}
            size={18}
          />
          <span className="hidden sm:inline">Dashboard</span>
        </div>
      </Link>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

      <ButtonIcon
        className="text-slate-400 hover:bg-red-50! hover:text-red-500! dark:hover:bg-red-950/30! dark:hover:text-red-400!"
        disableAnimation
        onClick={() => signOut()}
        shape="rounded"
        size="sm"
        title="Sign Out"
        variant="ghost"
      >
        <HugeiconsIcon icon={Logout04Icon} size={18} />
      </ButtonIcon>

      <Link className="flex" href="/profile">
        <Avatar
          className="ring-2 ring-transparent transition-all hover:ring-violet-500 hover:ring-offset-1 rounded-lg"
          shape="rounded"
          size="sm"
          src={session?.user?.image}
        />
      </Link>
    </div>
  );
};
