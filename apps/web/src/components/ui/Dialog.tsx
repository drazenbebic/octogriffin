import { forwardRef } from 'react';

import type { DialogProps as BaseDialogProps } from '@ariakit/react';
import { Dialog as BaseDialog } from '@ariakit/react';

import { DialogBackdrop } from '@/components/ui/DialogBackdrop';
import { cn } from '@/utils/cn';

export type DialogProps = {
  size?: 'lg' | 'md' | 'sm' | 'xl';
} & BaseDialogProps;

const sizes = {
  lg: 'max-w-3xl',
  md: 'max-w-2xl',
  sm: 'max-w-lg',
  xl: 'max-w-[920px]',
};

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <BaseDialog
        backdrop={<DialogBackdrop />}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2',
          'rounded-xl border border-border bg-raised p-6 text-text shadow-e3 dark:border-border-strong' /* token: dialog edge */,
          'scale-[0.98] opacity-0 transition-[opacity,scale] duration-[var(--dur-base)] ease-out',
          'data-enter:scale-100 data-enter:opacity-100',
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
