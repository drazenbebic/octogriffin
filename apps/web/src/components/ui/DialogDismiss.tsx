import { forwardRef } from 'react';

import {
  DialogDismiss as BaseDialogDismiss,
  DialogDismissProps as BaseDialogDismissProps,
} from '@ariakit/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { cn } from '@/utils/cn';

export type DialogDismissProps = {
  label?: string;
} & BaseDialogDismissProps;

export const DialogDismiss = forwardRef<HTMLButtonElement, DialogDismissProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <BaseDialogDismiss
        aria-label={label || 'Close modal'}
        className={cn(
          'inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-transparent focus:border-violet-600 focus:outline-none focus:ring-4 focus:ring-violet-600/10 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300',
          className,
        )}
        ref={ref}
        {...props}
      >
        <HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} size={20} />
      </BaseDialogDismiss>
    );
  },
);

DialogDismiss.displayName = 'DialogDismiss';
