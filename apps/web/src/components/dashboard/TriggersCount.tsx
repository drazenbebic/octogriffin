'use client';

import type { FC } from 'react';

import { useTriggersStore } from '@/store/useTriggersStore';

/** The trigger count shown in the Triggers tab. */
export const TriggersCount: FC = () => {
  const total = useTriggersStore(state => state.meta.total);

  if (!total) {
    return null;
  }

  return (
    <span className="rounded-full bg-accent-soft px-1.5 text-[11px] font-semibold text-accent-text">
      {total}
    </span>
  );
};
