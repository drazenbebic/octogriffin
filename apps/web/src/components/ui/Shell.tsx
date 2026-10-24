import type { ElementType, FC, ReactNode } from 'react';

import { cn } from '@/utils/cn';

export type ShellProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  id?: string;
};

/**
 * The one page width every route shares, header and footer included.
 */
export const Shell: FC<ShellProps> = ({
  as: Tag = 'div',
  children,
  className,
  ...props
}) => (
  <Tag
    className={cn(
      'mx-auto w-full max-w-[calc(var(--container-shell)+2rem)] px-4 sm:max-w-[calc(var(--container-shell)+3rem)] sm:px-6 lg:max-w-[calc(var(--container-shell)+4rem)] lg:px-8',
      className,
    )}
    {...props}
  >
    {children}
  </Tag>
);
