import { FC, ReactNode } from 'react';

import clsx from 'clsx';
import { CommandLineIcon } from 'hugeicons-react';

export type DocsCommandProps = {
  align?: 'start' | 'center';
  className?: string;
  children?: ReactNode;
  hideIcon?: boolean;
};

export const DocsCommand: FC<DocsCommandProps> = ({
  align = 'center',
  className,
  children,
  hideIcon = false,
}) => {
  return (
    <div
      className={clsx(
        'flex gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
        {
          'items-center': align === 'center',
          'items-start': align === 'start',
        },
        className,
      )}
    >
      {!hideIcon && (
        <CommandLineIcon
          size={20}
          className={clsx('text-slate-400 shrink-0 dark:text-slate-500', {
            'mt-px': align === 'start',
          })}
        />
      )}
      <code>{children}</code>
    </div>
  );
};
