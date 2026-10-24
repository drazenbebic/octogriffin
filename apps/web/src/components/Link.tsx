import type { LinkProps as NextLinkProps } from 'next/link';
import NextLink from 'next/link';
import type { FC, ReactNode } from 'react';

import { cn } from '@/utils/cn';

export type LinkProps = {
  children: ReactNode;
  className?: string;
  target?: string;
} & NextLinkProps;

export const Link: FC<LinkProps> = ({ children, className, ...props }) => {
  return (
    <NextLink
      className={cn(
        'transition-colors text-accent-text hover:text-accent-text hover:underline ',
        className,
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
};
