import { forwardRef } from 'react';

import {
  Dialog as BaseDialog,
  DialogProps as BaseDialogProps,
} from '@ariakit/react';

import { DialogBackdrop } from '@/components/ui/DialogBackdrop';
import { cn } from '@/utils/cn';

export type DialogProps = {
  size?: 'lg' | 'md' | 'sm';
} & BaseDialogProps;

const sizes = {
  sm: 'max-w-lg',
  md: 'max-w-2xl',
  lg: 'max-w-3xl',
};

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <BaseDialog
        backdrop={<DialogBackdrop />}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2',
          'rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-900',
          'opacity-0 scale-95 transition-all duration-300 ease-out',
          'data-enter:opacity-100 data-enter:scale-100',
          sizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Dialog.displayName = 'Dialog';
