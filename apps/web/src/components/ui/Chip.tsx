import type { FC, HTMLAttributes, ReactNode } from 'react';

import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { cn } from '@/utils/cn';

export type ChipTone = 'accent' | 'hp' | 'mp' | 'neutral' | 'ok' | 'xp';

export type ChipProps = {
  children: ReactNode;
  dismissLabel?: string;
  dot?: boolean;
  onDismiss?: () => void;
  /** `pill` is for status only (connected, paused, in progress). */
  shape?: 'pill' | 'square';
  tone?: ChipTone;
} & HTMLAttributes<HTMLSpanElement>;

export const chipTones: Record<ChipTone, string> = {
  accent: 'bg-accent-soft text-accent-text',
  hp: 'bg-hp-soft text-hp',
  mp: 'bg-mp-soft text-mp',
  neutral: 'bg-fill text-text-2',
  ok: 'bg-ok-soft text-ok',
  xp: 'bg-xp-soft text-xp',
};

const dotTones: Record<ChipTone, string> = {
  accent: 'bg-accent',
  hp: 'bg-hp',
  mp: 'bg-mp',
  neutral: 'bg-muted',
  ok: 'bg-ok',
  xp: 'bg-xp',
};

export const Chip: FC<ChipProps> = ({
  children,
  className,
  dismissLabel = 'Remove',
  dot = false,
  onDismiss,
  shape = 'square',
  tone = 'neutral',
  ...props
}) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap',
      shape === 'pill'
        ? 'rounded-full px-2.5 py-0.5'
        : 'rounded-sm px-2 py-0.5',
      onDismiss && 'pr-1',
      chipTones[tone],
      className,
    )}
    {...props}
  >
    {dot && (
      <span
        aria-hidden="true"
        className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dotTones[tone])}
      />
    )}
    {children}
    {!!onDismiss && (
      <button
        aria-label={dismissLabel}
        className="grid h-5 w-5 cursor-pointer place-items-center rounded-[4px] opacity-70 hover:bg-fill hover:opacity-100"
        onClick={onDismiss}
        type="button"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={12} />
      </button>
    )}
  </span>
);
