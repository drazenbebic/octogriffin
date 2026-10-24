import type { FC, ReactNode } from 'react';

import { DialogHeading } from '@ariakit/react';
import type { IconSvgElement } from '@hugeicons/react';
import { HugeiconsIcon } from '@hugeicons/react';

import { DialogDismiss } from '@/components/ui/DialogDismiss';

export type DialogHeaderProps = {
  /** Extra controls between the title and the close button. */
  actions?: ReactNode;
  icon?: IconSvgElement;
  onCloseLabel: string;
  title: ReactNode;
};

export const DialogHeader: FC<DialogHeaderProps> = ({
  actions,
  icon,
  onCloseLabel,
  title,
}) => (
  <div className="-mx-6 -mt-6 mb-0 flex items-center justify-between gap-4 border-b border-border px-6 py-5">
    <div className="flex items-center gap-3">
      {!!icon && (
        <span className="grid h-10 w-10 place-items-center rounded-md bg-accent-soft text-accent-text">
          <HugeiconsIcon icon={icon} size={20} />
        </span>
      )}
      <DialogHeading
        className="font-display text-[22px] leading-tight font-bold tracking-[-0.02em]"
        render={<h2 />}
      >
        {title}
      </DialogHeading>
    </div>
    <div className="flex items-center gap-2">
      {actions}
      <DialogDismiss label={onCloseLabel} />
    </div>
  </div>
);

export type DialogFooterProps = {
  children: ReactNode;
  /** Shown on the left, e.g. a note about required fields. */
  start?: ReactNode;
};

export const DialogFooter: FC<DialogFooterProps> = ({ children, start }) => (
  <div className="sticky -bottom-6 -mx-6 -mb-6 flex items-center justify-between gap-4 border-t border-border bg-raised px-6 py-4">
    <div className="text-xs text-muted">{start}</div>
    <div className="flex gap-2.5">{children}</div>
  </div>
);
