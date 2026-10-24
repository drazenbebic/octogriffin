import type { FC } from 'react';

import { cn } from '@/utils/cn';
import { getDifficulty } from '@/utils/difficulty';

export type DifficultyLabelProps = {
  className?: string;
  priority: number;
};

export const DifficultyLabel: FC<DifficultyLabelProps> = ({
  className,
  priority,
}) => {
  const { label, stars } = getDifficulty(priority);

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      {label}
      <span aria-hidden="true" className="tracking-[1px] text-xp">
        {stars ? '★'.repeat(stars) : '·'}
      </span>
    </span>
  );
};
