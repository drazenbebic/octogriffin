import { forwardRef } from 'react';

import type { DialogDismissProps as BaseDialogDismissProps } from '@ariakit/react';
import { DialogDismiss as BaseDialogDismiss } from '@ariakit/react';
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
          'inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-muted hover:bg-fill hover:text-text-2 border border-transparent focus:border-accent focus:outline-none focus:ring-4 focus:ring-ring ',
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
