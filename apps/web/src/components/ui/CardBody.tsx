import { FC, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

export type CardBodyProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  noPadding?: boolean;
  padding?: 'sm' | 'md' | 'lg';
};

export const CardBody: FC<CardBodyProps> = ({
  children,
  className,
  noPadding = false,
  padding = 'md',
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        {
          'p-4 sm:p-5': padding === 'sm' && !noPadding,
          'p-6 sm:p-8': padding === 'md' && !noPadding,
          'p-8 sm:p-12': padding === 'lg' && !noPadding,
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
