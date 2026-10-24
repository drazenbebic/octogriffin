'use client';

import type { FC, MouseEvent, Ref } from 'react';
import {
  forwardRef,
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

import { Chip } from '@/components/ui/Chip';
import { ComboboxItem } from '@/components/ui/ComboboxItem';
import { cn } from '@/utils/cn';

export type ComboboxItemType = {
  group?: string;
  label: string;
  value: string;
};

type ComboboxBaseProps = {
  className?: string;
  disabled?: boolean;
  disableLabel?: boolean;
  items: ComboboxItemType[];
  label?: string;
  placeholder?: string;
  required?: boolean;
};

type ComboboxSingleProps = ComboboxBaseProps & {
  defaultValue?: string;
  multiple?: false;
  onChangeAction?: (value: string) => void;
};

type ComboboxMultipleProps = ComboboxBaseProps & {
  defaultValue?: string[];
  multiple: true;
  onChangeAction?: (value: string[]) => void;
};

export type ComboboxProps = ComboboxMultipleProps | ComboboxSingleProps;

const singleInputStyles =
  'relative flex w-full items-center justify-between rounded-lg border border-border-strong bg-surface px-5 py-2.5 text-left text-text transition-all duration-200 ease-in-out placeholder:text-faint focus:border-accent focus:outline-none focus:ring-4 focus:ring-ring hover:bg-fill disabled:opacity-50 disabled:pointer-events-none aria-invalid:border-hp aria-invalid:focus:border-hp aria-invalid:focus:ring-hp/20 aria-invalid:bg-hp-soft ';

const multiWrapperStyles =
  'group relative flex w-full flex-wrap items-center gap-1.5 cursor-text rounded-lg border border-border-strong bg-surface pl-3 pr-10 py-1.5 min-h-11 text-left text-text transition-all duration-200 ease-in-out hover:bg-fill focus-within:border-accent focus-within:hover:bg-surface focus-within:ring-4 focus-within:ring-ring has-[input:disabled]:opacity-50 has-[input:disabled]:pointer-events-none has-[input[aria-invalid="true"]]:border-hp has-[input[aria-invalid="true"]]:bg-hp-soft has-[input[aria-invalid="true"]]:focus-within:ring-hp/20';

const multiInputStyles =
  'flex-1 min-w-24 bg-transparent py-1 outline-none placeholder:text-faint';

const popoverStyles =
  'z-50 flex max-h-75 min-w-45 flex-col overflow-auto rounded-2xl border border-line bg-surface p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none ';

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

const ComboboxMatches: FC<{
  hasGroups: boolean;
  matches: [string, ComboboxItemType[]][] | ComboboxItemType[];
}> = ({ hasGroups, matches }) => {
  if (hasGroups) {
    return (
      <>
        {(matches as [string, ComboboxItemType[]][]).map(
          ([group, groupItems]) => (
            <ComboboxGroup
              className="flex flex-col gap-1 first:mt-0 mt-2"
              key={group}
            >
              <ComboboxGroupLabel className="sticky -top-1.5 z-10 bg-surface px-3 pb-2 pt-3.5 text-xs font-bold uppercase tracking-wider text-muted select-none ">
                {group}
              </ComboboxGroupLabel>
              {groupItems.map(item => (
                <ComboboxItem item={item} key={item.value} />
              ))}
            </ComboboxGroup>
          ),
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {(matches as ComboboxItemType[]).map(item => (
        <ComboboxItem item={item} key={item.value} />
      ))}
    </div>
  );
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
            <ComboboxLabel className="text-sm font-medium text-text-2 ">
              {label}
            </ComboboxLabel>
          )}

          {props.multiple ? (
            <div
              className={multiWrapperStyles}
              onMouseDown={handleWrapperMouseDown}
            >
              {selectedItems.map(item => (
                <Chip
                  className="h-7 border border-border bg-surface pl-2.5 text-[13px] font-normal text-text"
                  dismissLabel={`Remove ${item.label}`}
                  key={item.value}
                  onDismiss={() => handleDismiss(item.value)}
                >
                  {item.label}
                </Chip>
              ))}
              <BaseCombobox
                className={multiInputStyles}
                placeholder={
                  selectedItems.length === 0 ? placeholder : undefined
                }
                ref={inputRefCallback}
                {...inputProps}
              />
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">
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
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">
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
              <ComboboxMatches hasGroups={hasGroups} matches={matches} />
            ) : (
              <div className="px-4 py-3 text-center text-sm text-muted select-none ">
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
