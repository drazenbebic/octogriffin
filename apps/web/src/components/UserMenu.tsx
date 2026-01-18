'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

import { Button as AriakitButton } from '@ariakit/react';
import {
  DashboardSquare02Icon,
  GithubIcon,
  Logout04Icon,
  UserCircleIcon,
} from 'hugeicons-react';

import { Button } from '@/components/ui/Button';

export const UserMenu: FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="h-10 w-24 rounded-full bg-slate-200" />
        <div className="h-10 w-10 rounded-full bg-slate-200" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Button
        size="sm"
        className="pl-5 pr-6"
        onClick={() => signIn('github', { callbackUrl: window.location.href })}
      >
        <GithubIcon size={18} className="mr-2" />
        Sign In
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-2 shadow-sm transition-all hover:border-violet-200 hover:shadow-md hover:shadow-violet-900/5">
      <Link href="/dashboard" title="Go to Dashboard">
        <div className="group flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-700">
          <DashboardSquare02Icon
            size={18}
            className="text-slate-400 transition-colors group-hover:text-violet-600"
          />
          <span className="hidden sm:inline">Dashboard</span>
        </div>
      </Link>

      <div className="h-5 w-px bg-slate-200"></div>

      <AriakitButton
        onClick={() => signOut()}
        className="group flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 cursor-pointer"
        title="Sign Out"
      >
        <Logout04Icon size={18} />
      </AriakitButton>

      <Link href="/profile" className="ml-1">
        <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-transparent transition-all hover:ring-violet-500">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-violet-100 text-violet-600">
              <UserCircleIcon size={20} />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};
