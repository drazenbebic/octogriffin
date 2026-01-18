import { forwardRef } from 'react';

import {
  Dialog as BaseDialog,
  DialogProps as BaseDialogProps,
} from '@ariakit/react';
import clsx from 'clsx';

import { DialogBackdrop } from '@/components/ui/DialogBackdrop';

export type DialogProps = BaseDialogProps;

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseDialog
        ref={ref}
        backdrop={<DialogBackdrop />}
        className={clsx(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
          'rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200',
          'opacity-0 scale-95 transition-all duration-300 ease-out',
          'data-enter:opacity-100 data-enter:scale-100',
          className,
        )}
        {...props}
      />
    );
  },
);

Dialog.displayName = 'Dialog';
