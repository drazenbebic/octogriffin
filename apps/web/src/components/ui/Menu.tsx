'use client';

import NextLink from 'next/link';
import type { FC, ReactElement, ReactNode } from 'react';

import {
  Menu as BaseMenu,
  MenuItem as BaseMenuItem,
  MenuSeparator as BaseMenuSeparator,
  MenuButton,
  MenuProvider,
} from '@ariakit/react';
import type { IconSvgElement } from '@hugeicons/react';
import { HugeiconsIcon } from '@hugeicons/react';

import { cn } from '@/utils/cn';

export type MenuProps = {
  children: ReactNode;
  /** Shown above the items, e.g. the signed-in user. */
  header?: ReactNode;
  /** The accessible name of the trigger. */
  label: string;
  trigger: ReactElement;
};

export const Menu: FC<MenuProps> = ({ children, header, label, trigger }) => (
  <MenuProvider placement="bottom-end">
    <MenuButton aria-label={label} render={trigger} />
    <BaseMenu
      className={cn(
        'z-[60] flex min-w-56 flex-col rounded-md border border-border bg-raised p-1.5 text-text shadow-e2 outline-none',
        'opacity-0 transition-opacity duration-[var(--dur-base)] ease-out data-enter:opacity-100',
      )}
      gutter={8}
    >
      {!!header && (
        <div className="mb-1 border-b border-border px-2.5 pt-1.5 pb-2.5">
          {header}
        </div>
      )}
      {children}
    </BaseMenu>
  </MenuProvider>
);

export type MenuItemProps = {
  children: ReactNode;
  href?: string;
  icon?: IconSvgElement;
  onClick?: () => void;
  tone?: 'danger' | 'default';
};

export const MenuItem: FC<MenuItemProps> = ({
  children,
  href,
  icon,
  onClick,
  tone = 'default',
}) => (
  <BaseMenuItem
    className={cn(
      'flex cursor-pointer items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-[13px] outline-none data-active-item:bg-fill',
      tone === 'danger' ? 'text-hp' : 'text-text',
    )}
    onClick={onClick}
    render={href ? <NextLink href={href} /> : undefined}
  >
    {!!icon && <HugeiconsIcon icon={icon} size={16} />}
    {children}
  </BaseMenuItem>
);

export const MenuSeparator: FC = () => (
  <BaseMenuSeparator className="my-1 h-px border-0 bg-border" />
);
