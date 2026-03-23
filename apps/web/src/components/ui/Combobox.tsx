'use client';

import { FC, useDeferredValue, useMemo, useState, useTransition } from 'react';

import {
  Combobox as BaseCombobox,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxLabel,
  ComboboxPopover,
  ComboboxProvider,
} from '@ariakit/react';
import clsx from 'clsx';
import { ArrowDown01Icon } from 'hugeicons-react';
import groupBy from 'lodash/groupBy';
import { matchSorter } from 'match-sorter';

import { ComboboxItem } from '@/components/ui/ComboboxItem';

export type ComboboxItemType = {
  value: string;
  label: string;
  group?: string;
};

export type ComboboxProps = {
  className?: string;
  defaultValue?: string;
  disableLabel?: boolean;
  items: ComboboxItemType[];
  label?: string;
  onChangeAction?: (value: string) => void;
  placeholder?: string;
  selectedValues?: string[];
};

const errorStyles =
  'aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/10 aria-invalid:bg-red-50/50 dark:aria-invalid:bg-red-900/10 dark:aria-invalid:border-red-900/50';

export const Combobox: FC<ComboboxProps> = ({
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
  const [selectedValue, setSelectedValue] = useState<string>(
    defaultValue || '',
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

  return (
    <ComboboxProvider
      defaultValue={defaultValue}
      selectedValue={selectedValue}
      setSelectedValue={val => {
        setSelectedValue(val);
        onChangeAction?.(val);
      }}
      setValue={val => {
        startTransition(() => {
          setSearchValue(val);
        });
      }}
    >
      <div className={clsx('flex w-full flex-col gap-1.5', className)}>
        {!disableLabel && label && (
          <ComboboxLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </ComboboxLabel>
        )}

        <div className="relative">
          <BaseCombobox
            placeholder={placeholder}
            className={clsx(
              'relative flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-left text-slate-900 transition-all duration-200 ease-in-out placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-600/10 hover:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:focus:border-violet-500 dark:hover:bg-slate-800',
              errorStyles,
            )}
            {...props}
          />
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <ArrowDown01Icon size={16} />
          </div>
        </div>

        <ComboboxPopover
          sameWidth
          gutter={8}
          className={clsx(
            'z-50 flex max-h-75 min-w-45 flex-col overflow-auto rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none dark:bg-slate-900 dark:border-slate-800 dark:ring-slate-800',
          )}
          aria-busy={isPending}
        >
          {matches?.length > 0 ? (
            hasGroups ? (
              (matches as [string, ComboboxItemType[]][]).map(
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
                {(matches as ComboboxItemType[]).map(item => (
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
