import { forwardRef } from 'react';

import {
  DialogDismiss as BaseDialogDismiss,
  DialogDismissProps as BaseDialogDismissProps,
} from '@ariakit/react';
import clsx from 'clsx';
import { Cancel01Icon } from 'hugeicons-react';

export type DialogDismissProps = BaseDialogDismissProps & {
  label?: string;
};

export const DialogDismiss = forwardRef<HTMLButtonElement, DialogDismissProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <BaseDialogDismiss
        ref={ref}
        className={clsx(
          'cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-transparent focus:border-violet-600 focus:outline-none focus:ring-4 focus:ring-violet-600/10',
          className,
        )}
        {...props}
      >
        <Cancel01Icon aria-label={label || 'Close modal'} size={20} />
      </BaseDialogDismiss>
    );
  },
);

DialogDismiss.displayName = 'DialogDismiss';
