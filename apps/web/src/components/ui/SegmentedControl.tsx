'use client';

import type { ReactNode } from 'react';
import { useId } from 'react';

import { Radio, RadioGroup, RadioProvider } from '@ariakit/react';

import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/utils/cn';

export type SegmentTooltip = {
  description: string;
  title: string;
};

export type SegmentOption<V extends string> = {
  label: ReactNode;
  /** The accessible name, when the label isn't plain text. */
  name?: string;
  tooltip?: SegmentTooltip;
  value: V;
};

export type SegmentedControlProps<V extends string> = {
  className?: string;
  /** Labels the group. Visually hidden when `showLabel` is false. */
  label: string;
  onChange: (value: V) => void;
  options: SegmentOption<V>[];
  showLabel?: boolean;
  size?: 'lg' | 'md';
  value: V;
};

const segmentClass = (size: 'lg' | 'md') =>
  cn(
    'relative flex cursor-pointer items-center justify-center gap-1.5 rounded-[8px] px-3 text-[13px] font-medium text-text-2 outline-none transition-colors duration-[var(--dur-fast)]',
    'hover:text-text',
    'has-focus-visible:ring-2 has-focus-visible:ring-accent',
    'has-checked:font-semibold has-checked:text-text',
    size === 'lg' ? 'h-11' : 'h-10',
  );

// Matches the group's p-1 and gap-1
const INSET = 4;

export const SegmentedControl = <V extends string>({
  className,
  label,
  onChange,
  options,
  showLabel = true,
  size = 'md',
  value,
}: SegmentedControlProps<V>) => {
  const labelId = useId();
  const selectedIndex = options.findIndex(option => option.value === value);
  const count = options.length;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span
        className={cn(
          'text-[13px] font-semibold text-text',
          !showLabel && 'sr-only',
        )}
        id={labelId}
      >
        {label}
      </span>
      <RadioProvider
        orientation="horizontal"
        setValue={next => onChange(next as V)}
        value={value}
      >
        <RadioGroup
          aria-labelledby={labelId}
          className="relative grid gap-1 rounded-[12px] border border-border bg-sunken p-1"
          style={{
            gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
          }}
        >
          {/* The highlight slides to the checked segment instead of jumping */}
          {selectedIndex >= 0 && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute rounded-[8px] border border-border-strong bg-raised shadow-lift transition-transform duration-[var(--dur-base)] ease-out"
              style={{
                bottom: INSET,
                left: INSET,
                top: INSET,
                transform: `translateX(calc(${selectedIndex} * (100% + ${INSET}px)))`,
                width: `calc((100% - ${INSET * (count + 1)}px) / ${count})`,
              }}
            />
          )}
          {options.map(option => {
            // A native radio, so arrow keys select as well as move
            const radio = (
              <label className={segmentClass(size)} key={option.value}>
                <Radio
                  aria-label={option.name}
                  className="sr-only"
                  value={option.value}
                />
                {option.label}
              </label>
            );

            return option.tooltip ? (
              <Tooltip
                content={option.tooltip.description}
                key={option.value}
                title={option.tooltip.title}
              >
                {radio}
              </Tooltip>
            ) : (
              radio
            );
          })}
        </RadioGroup>
      </RadioProvider>
    </div>
  );
};
