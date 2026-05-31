import { FC, ReactNode } from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

import { cn } from '@/utils/cn';

export type LinkProps = NextLinkProps & {
  children: ReactNode;
  className?: string;
  target?: string;
};

export const Link: FC<LinkProps> = ({ children, className, ...props }) => {
  return (
    <NextLink
      className={cn(
        'transition-colors text-violet-600 hover:text-violet-600 hover:underline dark:text-violet-400 dark:hover:text-violet-300',
        className,
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
};
