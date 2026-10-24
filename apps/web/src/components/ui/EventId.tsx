import type { FC } from 'react';

import { cn } from '@/utils/cn';

export type EventIdProps = {
  className?: string;
  event: string;
};

/** A GitHub event ID like `pull_request.opened`, set as code. */
export const EventId: FC<EventIdProps> = ({ className, event }) => (
  <code
    className={cn(
      'rounded-sm bg-fill px-1.5 py-0.5 font-mono text-xs text-text-2',
      className,
    )}
  >
    {event}
  </code>
);
