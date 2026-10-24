'use client';

import type { FC } from 'react';

import type { ChipTone } from '@/components/ui/Chip';
import { chipTones } from '@/components/ui/Chip';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/utils/cn';

export type HabiticaAttribute = 'con' | 'int' | 'per' | 'str';

export const attributes: Record<
  HabiticaAttribute,
  { description: string; title: string; tone: ChipTone }
> = {
  con: {
    description:
      'Reduces the damage you take from missed Dailies and bad habits.',
    title: 'Constitution',
    tone: 'xp',
  },
  int: {
    description: 'Raises the XP you earn and your maximum mana.',
    title: 'Intelligence',
    tone: 'mp',
  },
  per: {
    description: 'Raises the Gold you earn and your chance of finding items.',
    title: 'Perception',
    tone: 'accent',
  },
  str: {
    description: 'Raises damage to bosses and your chance of critical hits.',
    title: 'Strength',
    tone: 'hp',
  },
};

// Habitica's own order. Ranks rather than an array, which lint would sort.
const attributeRank: Record<HabiticaAttribute, number> = {
  con: 2,
  int: 1,
  per: 3,
  str: 0,
};

/** STR, INT, CON, PER: the order Habitica lists attributes in. */
export const attributeOrder = (
  Object.keys(attributeRank) as HabiticaAttribute[]
).sort((a, b) => attributeRank[a] - attributeRank[b]);

export type AttributeChipProps = {
  attribute: HabiticaAttribute;
  className?: string;
};

export const AttributeChip: FC<AttributeChipProps> = ({
  attribute,
  className,
}) => {
  const { description, title, tone } = attributes[attribute];

  return (
    <Tooltip content={description} title={title}>
      <button
        className={cn(
          'inline-flex cursor-help rounded-sm px-1.5 py-0.5 font-mono text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-accent',
          chipTones[tone],
          className,
        )}
        type="button"
      >
        {attribute.toUpperCase()}
      </button>
    </Tooltip>
  );
};
