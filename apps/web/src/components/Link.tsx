import { FC, ReactNode } from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

import clsx from 'clsx';

export type LinkProps = NextLinkProps & {
  children: ReactNode;
  className?: string;
  target?: string;
};

export const Link: FC<LinkProps> = ({ children, className, ...props }) => {
  return (
    <NextLink
      className={clsx(
        'transition-colors text-violet-600 hover:text-violet-600 hover:underline',
        className,
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
};
