'use client';

import {
  forwardRef,
  MouseEvent,
  Ref,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

import {
  Combobox as BaseCombobox,
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

export type ComboboxItemType = {
  value: string;
  label: string;
  group?: string;
};

type ComboboxBaseProps = {
  className?: string;
  disableLabel?: boolean;
  items: ComboboxItemType[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
};

type ComboboxSingleProps = ComboboxBaseProps & {
  multiple?: false;
  defaultValue?: string;
  onChangeAction?: (value: string) => void;
};

type ComboboxMultipleProps = ComboboxBaseProps & {
  multiple: true;
  defaultValue?: string[];
  onChangeAction?: (value: string[]) => void;
};

export type ComboboxProps = ComboboxMultipleProps | ComboboxSingleProps;

const singleInputStyles =
  'relative flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-left text-slate-900 transition-all duration-200 ease-in-out placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-600/10 hover:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 dark:focus:border-violet-500 dark:hover:bg-slate-900 aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/10 aria-invalid:bg-red-50/50 dark:aria-invalid:bg-red-900/10 dark:aria-invalid:border-red-900/50';

const multiWrapperStyles =
  'group relative flex w-full flex-wrap items-center gap-1.5 cursor-text rounded-lg border border-slate-300 bg-white pl-3 pr-10 py-1.5 min-h-11 text-left text-slate-900 transition-all duration-200 ease-in-out hover:bg-slate-100 focus-within:border-violet-500 focus-within:hover:bg-white focus-within:ring-4 focus-within:ring-violet-600/10 has-[input:disabled]:opacity-50 has-[input:disabled]:pointer-events-none dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 dark:focus-within:border-violet-500 dark:hover:bg-slate-900 dark:focus-within:hover:bg-slate-950 has-[input[aria-invalid="true"]]:border-red-500 has-[input[aria-invalid="true"]]:bg-red-50/50 has-[input[aria-invalid="true"]]:focus-within:ring-red-500/10 dark:has-[input[aria-invalid="true"]]:border-red-900/50 dark:has-[input[aria-invalid="true"]]:bg-red-900/10';

const multiInputStyles =
  'flex-1 min-w-24 bg-transparent py-1 outline-none placeholder:text-slate-400';

const popoverStyles =
  'z-50 flex max-h-75 min-w-45 flex-col overflow-auto rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none dark:bg-slate-900 dark:border-slate-800 dark:ring-slate-800';

const setRef = (
  ref: Ref<HTMLInputElement> | undefined,
  node: HTMLInputElement | null,
) => {
  if (typeof ref === 'function') {
    ref(node);
  } else if (ref) {
    (ref as { current: HTMLInputElement | null }).current = node;
  }
};

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (props, externalRef) => {
    const {
      className,
      disableLabel = false,
      items,
      label,
      placeholder,
      ...inputProps
    } = props as { multiple?: boolean } & ComboboxBaseProps;

    const [isPending, startTransition] = useTransition();
    const [searchValue, setSearchValue] = useState('');
    const deferredSearchValue = useDeferredValue(searchValue);

    const [selected, setSelected] = useState<string | string[]>(() =>
      props.multiple ? (props.defaultValue ?? []) : (props.defaultValue ?? ''),
    );

    const hasGroups = useMemo(
      () => items.every(item => !!item?.group),
      [items],
    );

    const matches = useMemo(() => {
      if (hasGroups) {
        const sorted = matchSorter(items, deferredSearchValue, {
          keys: ['label'],
        });

        return Object.entries(groupBy(sorted, 'group'));
      }

      return matchSorter(items, deferredSearchValue, { keys: ['label'] });
    }, [deferredSearchValue, hasGroups, items]);

    const internalRef = useRef<HTMLInputElement>(null);
    const inputRefCallback = (node: HTMLInputElement | null) => {
      internalRef.current = node;
      setRef(externalRef, node);
    };

    const selectedItems = useMemo(() => {
      if (!props.multiple) {
        return [];
      }

      return (selected as string[])
        .map(value => items.find(item => item.value === value))
        .filter((item): item is ComboboxItemType => !!item);
    }, [props.multiple, items, selected]);

    const handleDismiss = (value: string) => {
      if (!props.multiple) {
        return;
      }

      const newVal = (selected as string[]).filter(v => v !== value);
      setSelected(newVal);
      props.onChangeAction?.(newVal);
      internalRef.current?.focus();
    };

    const handleWrapperMouseDown = (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        e.preventDefault();
        internalRef.current?.focus();
      }
    };

    const setSelectedValue = (val: readonly string[] | string) => {
      if (props.multiple) {
        const newVal = Array.isArray(val) ? [...val] : [val as string];
        setSelected(newVal);
        props.onChangeAction?.(newVal);
      } else {
        const newVal = Array.isArray(val) ? (val[0] ?? '') : (val as string);
        setSelected(newVal);
        props.onChangeAction?.(newVal);
      }
    };

    return (
      <ComboboxProvider
        defaultValue={props.multiple ? undefined : props.defaultValue}
        selectedValue={selected}
        setSelectedValue={setSelectedValue}
        setValue={val => {
          startTransition(() => {
            setSearchValue(val);
          });
        }}
      >
        <div className={cn('flex w-full flex-col gap-1.5', className)}>
          {!disableLabel && label && (
            <ComboboxLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {label}
            </ComboboxLabel>
          )}

          {props.multiple ? (
            <div
              className={multiWrapperStyles}
              onMouseDown={handleWrapperMouseDown}
            >
              {selectedItems.map(item => (
                <DismissableBadge
                  dismissLabel={`Remove ${item.label}`}
                  key={item.value}
                  onDismiss={() => handleDismiss(item.value)}
                  variant="primary"
                >
                  {item.label}
                </DismissableBadge>
              ))}
              <BaseCombobox
                className={multiInputStyles}
                placeholder={
                  selectedItems.length === 0 ? placeholder : undefined
                }
                ref={inputRefCallback}
                {...inputProps}
              />
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
              </div>
            </div>
          ) : (
            <div className="relative">
              <BaseCombobox
                className={singleInputStyles}
                placeholder={placeholder}
                ref={inputRefCallback}
                {...inputProps}
              />
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
              </div>
            </div>
          )}

          <ComboboxPopover
            aria-busy={isPending}
            className={popoverStyles}
            flip={false}
            gutter={8}
            modal
            sameWidth
          >
            {matches?.length > 0 ? (
              hasGroups ? (
                (matches as [string, ComboboxItemType[]][]).map(
                  ([group, groupItems]) => (
                    <ComboboxGroup
                      className="flex flex-col gap-1 first:mt-0 mt-2"
                      key={group}
                    >
                      <ComboboxGroupLabel className="sticky -top-1.5 z-10 bg-white px-3 pb-2 pt-3.5 text-xs font-bold uppercase tracking-wider text-slate-400 select-none dark:bg-slate-900 dark:text-slate-500">
                        {group}
                      </ComboboxGroupLabel>
                      {groupItems.map(item => (
                        <ComboboxItem item={item} key={item.value} />
                      ))}
                    </ComboboxGroup>
                  ),
                )
              ) : (
                <div className="flex flex-col gap-1">
                  {(matches as ComboboxItemType[]).map(item => (
                    <ComboboxItem item={item} key={item.value} />
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
  },
);

Combobox.displayName = 'Combobox';
