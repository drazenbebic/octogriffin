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
          'fixed inset-0 z-40 bg-scrim backdrop-blur-[4px]',
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
