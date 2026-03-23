import { FC, HTMLAttributeAnchorTarget, ReactNode } from 'react';
import Link from 'next/link';

export type FooterLinkProps = {
  children: ReactNode;
  href: string;
  target?: HTMLAttributeAnchorTarget;
};

export const FooterLink: FC<FooterLinkProps> = ({ children, href, target }) => (
  <Link
    href={href}
    className="text-sm text-slate-600 transition-colors hover:text-violet-600 hover:underline dark:text-slate-400 dark:hover:text-violet-400"
    target={target}
  >
    {children}
  </Link>
);
