import Link from 'next/link';
import type { FC, HTMLAttributeAnchorTarget, ReactNode } from 'react';

export type FooterLinkProps = {
  children: ReactNode;
  href: string;
  target?: HTMLAttributeAnchorTarget;
};

export const FooterLink: FC<FooterLinkProps> = ({ children, href, target }) => (
  <Link
    className="w-fit text-sm text-text-2 transition-colors duration-[var(--dur-fast)] hover:text-accent-text"
    href={href}
    rel={target === '_blank' ? 'noreferrer' : undefined}
    target={target}
  >
    {children}
  </Link>
);
