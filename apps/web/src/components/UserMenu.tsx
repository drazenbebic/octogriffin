'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';

import {
  Activity01Icon,
  ArrowDown01Icon,
  GithubIcon,
  Logout04Icon,
  Settings01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Menu, MenuItem, MenuSeparator } from '@/components/ui/Menu';
import { cn } from '@/utils/cn';

export const UserMenu: FC = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === 'loading') {
    return (
      <div className="flex animate-pulse items-center gap-2">
        <div className="h-9 w-28 rounded-md bg-fill" />
        <div className="h-9 w-12 rounded-md bg-fill" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center gap-2">
        <Button
          className="hidden sm:inline-flex"
          onClick={() =>
            signIn('github', { callbackUrl: window.location.href })
          }
          size="sm"
          variant="secondary"
        >
          <HugeiconsIcon icon={GithubIcon} size={16} />
          Sign in
        </Button>
        <Button render={<Link href="/installation" />} size="sm">
          Install app
        </Button>
      </div>
    );
  }

  const name = session?.user?.name;
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <div className="flex items-center gap-2">
      <Link
        aria-current={isDashboard ? 'page' : undefined}
        className={cn(
          'hidden h-9 items-center rounded-md px-3 text-[13px] font-semibold text-text transition-colors duration-[var(--dur-fast)] hover:bg-fill sm:flex',
          isDashboard && 'bg-fill',
        )}
        href="/dashboard"
      >
        Dashboard
      </Link>

      <Menu
        header={
          <div className="flex items-center gap-2.5">
            <Avatar shape="rounded" size="sm" src={session?.user?.image} />
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold">{name}</span>
              {!!name && (
                <span className="font-mono text-[11px] text-muted">
                  @{name}
                </span>
              )}
            </div>
          </div>
        }
        label="Account menu"
        trigger={
          <button
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-border-strong bg-raised py-0.5 pr-2 pl-0.5 text-text-2 transition-colors duration-[var(--dur-fast)] hover:bg-sunken focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            type="button"
          >
            <Avatar shape="rounded" size="sm" src={session?.user?.image} />
            <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
          </button>
        }
      >
        <MenuItem href="/profile" icon={UserIcon}>
          Profile
        </MenuItem>
        <MenuItem href="/dashboard/settings" icon={Settings01Icon}>
          Habitica settings
        </MenuItem>
        <MenuItem href="/dashboard/history" icon={Activity01Icon}>
          History
        </MenuItem>
        <MenuSeparator />
        <MenuItem icon={Logout04Icon} onClick={() => signOut()} tone="danger">
          Sign out
        </MenuItem>
      </Menu>
    </div>
  );
};
