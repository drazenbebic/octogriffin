'use client';

import { FC, useState } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import { Dialog, DialogDisclosure, useDialogStore } from '@ariakit/react';
import clsx from 'clsx';
import {
  ArrowRight01Icon,
  Cancel01Icon,
  GithubIcon,
  Globe02Icon,
  Menu01Icon,
} from 'hugeicons-react';

import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';

const links = [
  {
    href: '/installation',
    label: 'Get Started',
    description: 'Installation Guide',
  },
  { href: '/docs', label: 'Documentation', description: 'Guides & API' },
  { href: '/roadmap', label: 'Roadmap', description: 'Future plans' },
  { href: '/sponsors', label: 'Sponsors', description: 'Our supporters' },
  { href: '/faq', label: 'FAQ', description: 'Questions' },
];

export const MobileMenu: FC = () => {
  const [open, setOpen] = useState(false);
  const dialog = useDialogStore({ open, setOpen });
  const pathname = usePathname();

  return (
    <>
      <DialogDisclosure
        store={dialog}
        className="flex h-9 w-9 items-center justify-center cursor-pointer rounded-lg text-slate-600 transition-colors hover:bg-slate-100 active:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 dark:active:bg-slate-700 md:hidden"
        aria-label={open ? 'Close Menu' : 'Open Menu'}
      >
        {open ? <Cancel01Icon size={20} /> : <Menu01Icon size={20} />}
      </DialogDisclosure>

      <Dialog
        store={dialog}
        modal
        className={clsx(
          'fixed inset-0 top-16 z-40 flex flex-col overflow-hidden',
          'bg-white/95 backdrop-blur-xl dark:bg-slate-950/95',
          'animate-in fade-in slide-in-from-top-2 duration-300 ease-out',
        )}
      >
        <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[16px_16px] opacity-50" />

        <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-80 w-80 rounded-full bg-violet-100 blur-3xl opacity-60 dark:bg-violet-900/20" />

        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <nav className="flex flex-col gap-6 pt-4">
            {links.map(({ href, label, description }) => {
              const isActive =
                href === '/' ? pathname === href : pathname.startsWith(href);

              return (
                <NextLink
                  key={href}
                  href={href}
                  onClick={() => dialog.hide()}
                  className="group flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span
                      className={clsx(
                        'text-3xl font-bold tracking-tight transition-all duration-200 group-hover:translate-x-2',
                        isActive
                          ? 'text-violet-600 dark:text-violet-400'
                          : 'text-slate-900 group-hover:text-violet-600 dark:text-slate-100 dark:group-hover:text-violet-400',
                      )}
                    >
                      {label}
                    </span>
                    <span className="text-sm font-medium text-slate-400 transition-all duration-200 group-hover:translate-x-2 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400">
                      {description}
                    </span>
                  </div>

                  <ArrowRight01Icon
                    size={24}
                    className={clsx(
                      'transition-all duration-300',
                      isActive
                        ? 'opacity-100 translate-x-0 text-violet-600 dark:text-violet-400'
                        : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-violet-400',
                    )}
                  />
                </NextLink>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-slate-100 pt-8 dark:border-slate-800">
            <div className="mb-6 flex gap-4">
              <NextLink
                href={githubRepositoryUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-900 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-100 dark:hover:text-slate-900"
                aria-label="GitHub Repository"
              >
                <GithubIcon size={20} />
              </NextLink>
              <NextLink
                href="https://www.bebic.dev"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-violet-600 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-violet-600 dark:hover:text-white"
                aria-label="Drazen Bebic Homepage"
              >
                <Globe02Icon size={20} />
              </NextLink>
            </div>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              &copy; {new Date().getFullYear()} Octogriffin. All rights
              reserved.
            </p>
          </div>
        </div>
      </Dialog>
    </>
  );
};
