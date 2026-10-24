'use client';

import type { FC } from 'react';

import type { ComboboxItemProps as BaseComboboxItemProps } from '@ariakit/react';
import {
  ComboboxItem as BaseComboboxItem,
  ComboboxItemCheck,
} from '@ariakit/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import type { ComboboxItemType } from '@/components/ui/Combobox';
import { cn } from '@/utils/cn';

export type ComboboxItemProps = {
  item: ComboboxItemType;
} & BaseComboboxItemProps;

export const ComboboxItem: FC<ComboboxItemProps> = ({ item }) => {
  return (
    <BaseComboboxItem
      className={cn(
        'group flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors',
        'text-text-2 ',
        'data-active-item:bg-accent-soft data-active-item:text-accent-text ',
        'aria-selected:bg-accent-soft aria-selected:font-medium aria-selected:text-text ',
      )}
      focusOnHover
      value={item.value}
    >
      <span className="truncate">{item.label}</span>
      <span className="flex items-center justify-center text-accent-text opacity-0 transition-opacity group-aria-selected:opacity-100 ">
        <HugeiconsIcon icon={Tick02Icon} size={16} />
        <span className="sr-only">
          <ComboboxItemCheck />
        </span>
      </span>
    </BaseComboboxItem>
  );
};
