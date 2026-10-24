'use client';

import { signIn, useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';
import { useState } from 'react';

import { Dialog, useDialogStore } from '@ariakit/react';
import { Cancel01Icon, Menu01Icon } from '@hugeicons/core-free-icons';

import { activeNavigationHref, navigationLinks } from '@/components/Navigation';
import { Button } from '@/components/ui/Button';
import { ButtonIcon } from '@/components/ui/ButtonIcon';
import { cn } from '@/utils/cn';

export const MobileMenu: FC = () => {
  const [open, setOpen] = useState(false);
  const dialog = useDialogStore({ open, setOpen });
  const pathname = usePathname() ?? '';
  const activeHref = activeNavigationHref(pathname);
  const { status } = useSession();

  return (
    <>
      <ButtonIcon
        aria-expanded={open}
        aria-haspopup="dialog"
        className="md:hidden"
        icon={open ? Cancel01Icon : Menu01Icon}
        label={open ? 'Close menu' : 'Open menu'}
        onClick={() => dialog.toggle()}
        size="md"
      />

      <Dialog
        className="fixed inset-0 top-16 z-40 flex flex-col overflow-y-auto bg-bg"
        modal
        store={dialog}
      >
        <nav aria-label="Mobile" className="flex flex-col px-4 pt-3">
          {navigationLinks.map(({ description, href, label }) => {
            const isActive = href === activeHref;

            return (
              <NextLink
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex min-h-14 items-center justify-between gap-4 border-b border-border px-1 py-3.5 last:border-b-0',
                  isActive ? 'text-accent-text' : 'text-text',
                )}
                href={href}
                key={href}
                onClick={() => dialog.hide()}
              >
                <span className="font-display text-[22px] font-bold tracking-[-0.02em]">
                  {label}
                </span>
                <span
                  className={cn(
                    'text-[13px]',
                    isActive ? 'text-accent-text' : 'text-muted',
                  )}
                >
                  {isActive ? 'You are here' : description}
                </span>
              </NextLink>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
          {status === 'authenticated' ? (
            <Button
              render={
                <NextLink href="/dashboard" onClick={() => dialog.hide()} />
              }
              size="lg"
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                render={
                  <NextLink
                    href="/installation"
                    onClick={() => dialog.hide()}
                  />
                }
                size="lg"
              >
                Install app
              </Button>
              <Button
                onClick={() =>
                  signIn('github', { callbackUrl: window.location.href })
                }
                size="lg"
                variant="secondary"
              >
                Sign in with GitHub
              </Button>
            </>
          )}
        </div>
      </Dialog>
    </>
  );
};
