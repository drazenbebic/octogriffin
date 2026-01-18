import { forwardRef } from 'react';

import clsx from 'clsx';

export type ModalBackdropProps = {
  className?: string;
};

export const DialogBackdrop = forwardRef<HTMLDivElement, ModalBackdropProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm',
          'opacity-0 transition-opacity duration-300 ease-out',
          'data-enter:opacity-100',
          className,
        )}
        {...props}
      />
    );
  },
);

DialogBackdrop.displayName = 'ModalBackdrop';
