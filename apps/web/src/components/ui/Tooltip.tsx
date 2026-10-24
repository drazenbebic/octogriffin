'use client';

import type { FC, ReactElement, ReactNode } from 'react';

import {
  Tooltip as BaseTooltip,
  TooltipAnchor,
  TooltipArrow,
  TooltipProvider,
} from '@ariakit/react';

import { Kbd } from '@/components/ui/Kbd';
import { cn } from '@/utils/cn';

export type TooltipProps = {
  children: ReactElement;
  content: ReactNode;
  placement?: 'bottom' | 'left' | 'right' | 'top';
  shortcut?: string;
  /** A bold first line, for tooltips that explain a term. */
  title?: string;
  /** "label" when the tooltip repeats the anchor's accessible name. */
  type?: 'description' | 'label';
};

export const Tooltip: FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  shortcut,
  title,
  type = 'description',
}) => (
  <TooltipProvider
    placement={placement}
    showTimeout={500}
    skipTimeout={300}
    type={type}
  >
    <TooltipAnchor render={children} />
    <BaseTooltip
      className={cn(
        'z-[60] max-w-60 rounded-sm border border-tip-border bg-tip-bg px-2 py-1.5 text-xs font-medium text-tip-text shadow-e2',
        'opacity-0 transition-opacity duration-[var(--dur-base)] ease-out data-enter:opacity-100',
        title && 'px-3 py-2.5',
      )}
      gutter={8}
    >
      <TooltipArrow className="[&_path]:fill-tip-bg [&_path]:stroke-tip-border" />
      {title ? (
        <span className="flex flex-col gap-0.5">
          <strong className="font-semibold">{title}</strong>
          <span className="font-normal opacity-80">{content}</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {content}
          {!!shortcut && <Kbd>{shortcut}</Kbd>}
        </span>
      )}
    </BaseTooltip>
  </TooltipProvider>
);
