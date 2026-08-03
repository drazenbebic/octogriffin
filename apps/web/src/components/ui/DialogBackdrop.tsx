import { forwardRef } from 'react';

import { cn } from '@/utils/cn';

export type ModalBackdropProps = {
  className?: string;
};

export const DialogBackdrop = forwardRef<HTMLDivElement, ModalBackdropProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm',
          'opacity-0 transition-opacity duration-300 ease-out',
          'data-enter:opacity-100',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

DialogBackdrop.displayName = 'ModalBackdrop';
