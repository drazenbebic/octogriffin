'use client';

import {
  FC,
  MouseEvent,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

import {
  Combobox,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxLabel,
  ComboboxPopover,
  ComboboxProvider,
} from '@ariakit/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import groupBy from 'lodash/groupBy';
import { matchSorter } from 'match-sorter';

import { ComboboxItem } from '@/components/ui/ComboboxItem';
import { DismissableBadge } from '@/components/ui/DismissableBadge';
import { cn } from '@/utils/cn';

export type MultiComboboxItemType = {
  value: string;
  label: string;
  group?: string;
};

export type MultiComboboxProps = {
  className?: string;
  defaultValue?: string[];
  disableLabel?: boolean;
  items: MultiComboboxItemType[];
  label?: string;
  onChangeAction?: (value: string[]) => void;
  placeholder?: string;
  selectedValues?: string[];
};

const wrapperErrorStyles =
  'has-[input[aria-invalid="true"]]:border-red-500 has-[input[aria-invalid="true"]]:bg-red-50/50 has-[input[aria-invalid="true"]]:focus-within:ring-red-500/10 dark:has-[input[aria-invalid="true"]]:border-red-900/50 dark:has-[input[aria-invalid="true"]]:bg-red-900/10';

export const MultiCombobox: FC<MultiComboboxProps> = ({
  className,
  defaultValue,
  disableLabel = false,
  items,
  label,
  onChangeAction,
  placeholder,
  ...props
}) => {
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState('');
  const deferredSearchValue = useDeferredValue(searchValue);
  const [selectedValues, setSelectedValues] = useState<string[]>(
    defaultValue || [],
  );

  const hasGroups = useMemo(() => items.every(item => !!item?.group), [items]);

  const matches = useMemo(() => {
    if (hasGroups) {
      const sorted = matchSorter(items, deferredSearchValue, {
        keys: ['label'],
      });

      return Object.entries(groupBy(sorted, 'group'));
    }

    return matchSorter(items, deferredSearchValue, { keys: ['label'] });
  }, [deferredSearchValue, hasGroups, items]);

  const selectedItems = useMemo(
    () =>
      selectedValues
        .map(value => items.find(item => item.value === value))
        .filter((item): item is MultiComboboxItemType => !!item),
    [items, selectedValues],
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDismiss = (value: string) => {
    const newVal = selectedValues.filter(v => v !== value);
    setSelectedValues(newVal);
    onChangeAction?.(newVal);
    inputRef.current?.focus();
  };

  const handleWrapperMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  return (
    <ComboboxProvider
      selectedValue={selectedValues}
      setSelectedValue={val => {
        const newVal = Array.isArray(val) ? val : [val];
        setSelectedValues(newVal);
        onChangeAction?.(newVal);
      }}
      setValue={value => {
        startTransition(() => {
          setSearchValue(value);
        });
      }}
    >
      <div className={cn('flex w-full flex-col gap-1.5', className)}>
        {!disableLabel && label && (
          <ComboboxLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </ComboboxLabel>
        )}

        <div
          onMouseDown={handleWrapperMouseDown}
          className={cn(
            'group relative flex w-full flex-wrap items-center gap-1.5 cursor-text rounded-lg border border-slate-300 bg-white pl-3 pr-10 py-1.5 min-h-11 text-left text-slate-900 transition-all duration-200 ease-in-out hover:bg-slate-100 focus-within:border-violet-500 focus-within:hover:bg-white focus-within:ring-4 focus-within:ring-violet-600/10 has-[input:disabled]:opacity-50 has-[input:disabled]:pointer-events-none dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 dark:focus-within:border-violet-500 dark:hover:bg-slate-900 dark:focus-within:hover:bg-slate-950',
            wrapperErrorStyles,
          )}
        >
          {selectedItems.map(item => (
            <DismissableBadge
              key={item.value}
              variant="primary"
              dismissLabel={`Remove ${item.label}`}
              onDismiss={() => handleDismiss(item.value)}
            >
              {item.label}
            </DismissableBadge>
          ))}

          <Combobox
            ref={inputRef}
            placeholder={selectedItems.length === 0 ? placeholder : undefined}
            className="flex-1 min-w-24 bg-transparent py-1 outline-none placeholder:text-slate-400"
            {...props}
          />

          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
          </div>
        </div>

        <ComboboxPopover
          modal
          sameWidth
          gutter={8}
          flip={false}
          className={cn(
            'z-50 flex max-h-75 min-w-45 flex-col overflow-auto rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none dark:bg-slate-900 dark:border-slate-800 dark:ring-slate-800',
          )}
          aria-busy={isPending}
        >
          {matches?.length > 0 ? (
            hasGroups ? (
              (matches as [string, MultiComboboxItemType[]][]).map(
                ([group, items]) => (
                  <ComboboxGroup
                    className="flex flex-col gap-1 first:mt-0 mt-2"
                    key={group}
                  >
                    <ComboboxGroupLabel className="sticky -top-1.5 z-10 bg-white px-3 pb-2 pt-3.5 text-xs font-bold uppercase tracking-wider text-slate-400 select-none dark:bg-slate-900 dark:text-slate-500">
                      {group}
                    </ComboboxGroupLabel>
                    {items.map(item => (
                      <ComboboxItem key={item.value} item={item} />
                    ))}
                  </ComboboxGroup>
                ),
              )
            ) : (
              <div className="flex flex-col gap-1">
                {(matches as MultiComboboxItemType[]).map(item => (
                  <ComboboxItem key={item.value} item={item} />
                ))}
              </div>
            )
          ) : (
            <div className="px-4 py-3 text-center text-sm text-slate-500 select-none dark:text-slate-400">
              No results found
            </div>
          )}
        </ComboboxPopover>
      </div>
    </ComboboxProvider>
  );
};
