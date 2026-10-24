'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';

import { GithubIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { MobileMenu } from '@/components/MobileMenu';
import { Navigation } from '@/components/Navigation';
import { NavigationUser } from '@/components/NavigationUser';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Shell } from '@/components/ui/Shell';
import { Tooltip } from '@/components/ui/Tooltip';
import { UserMenu } from '@/components/UserMenu';
import { useScrolled } from '@/hooks/useScrolled';
import { cn } from '@/utils/cn';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';

export const Header: FC = () => {
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-bg/80 backdrop-blur-md transition-colors duration-[var(--dur-base)]',
        scrolled ? 'border-border' : 'border-transparent',
      )}
    >
      <Shell className="flex h-16 items-center justify-between">
        <div className="flex h-full items-center gap-10">
          <Link className="flex items-center gap-2.5" href="/">
            <Image
              alt=""
              className="h-8 w-8 rounded-[8px] ring-1 ring-border"
              height={32}
              priority
              src="/octogriffin_logo_square.png"
              width={32}
            />
            <span className="font-display text-lg font-bold tracking-[-0.02em] text-text">
              Octogriffin
            </span>
          </Link>

          <Navigation className="hidden md:flex" />
        </div>

        <div className="flex items-center gap-1.5">
          <Tooltip content="Octogriffin on GitHub" type="label">
            <a
              aria-label="Octogriffin on GitHub"
              className="hidden h-9 w-9 items-center justify-center rounded-md text-text-2 transition-colors duration-[var(--dur-fast)] hover:bg-fill hover:text-text sm:flex"
              href={githubRepositoryUrl()}
              rel="noreferrer"
              target="_blank"
            >
              <HugeiconsIcon icon={GithubIcon} size={18} />
            </a>
          </Tooltip>
          <ThemeSwitcher />

          <span
            aria-hidden="true"
            className="mx-2 hidden h-5 w-px bg-border sm:block"
          />

          <NavigationUser>
            <UserMenu />
          </NavigationUser>

          <MobileMenu />
        </div>
      </Shell>
    </header>
  );
};
