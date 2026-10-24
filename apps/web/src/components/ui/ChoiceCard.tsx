'use client';

import type { FC, ReactNode } from 'react';
import { useId } from 'react';

import {
  Radio,
  RadioGroup,
  RadioProvider,
  useFormContext,
  useStoreState,
} from '@ariakit/react';
import type { IconSvgElement } from '@hugeicons/react';
import { HugeiconsIcon } from '@hugeicons/react';

import { cn } from '@/utils/cn';

export type ChoiceCardGroupProps = {
  children: ReactNode;
  label: string;
  /** The form field this group writes to. */
  name: string;
};

/** Large radio options bound to the surrounding Ariakit form by `name`. */
export const ChoiceCardGroup: FC<ChoiceCardGroupProps> = ({
  children,
  label,
  name,
}) => {
  const labelId = useId();
  const form = useFormContext();
  const value = useStoreState(form, state => String(state?.values[name] ?? ''));

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-semibold text-text" id={labelId}>
        {label}
      </span>
      <RadioProvider
        orientation="horizontal"
        setValue={next => form?.setValue(name, next)}
        value={value}
      >
        <RadioGroup
          aria-labelledby={labelId}
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
        >
          {children}
        </RadioGroup>
      </RadioProvider>
    </div>
  );
};

export type ChoiceCardProps = {
  description: string;
  icon: IconSvgElement;
  title: string;
  tone: 'hp' | 'ok';
  value: string;
};

const tones = {
  hp: 'has-checked:border-hp has-checked:bg-hp-soft has-checked:[&_.choice-icon]:bg-hp/15 has-checked:[&_.choice-icon]:text-hp',
  ok: 'has-checked:border-ok has-checked:bg-ok-soft has-checked:[&_.choice-icon]:bg-ok/15 has-checked:[&_.choice-icon]:text-ok',
};

export const ChoiceCard: FC<ChoiceCardProps> = ({
  description,
  icon,
  title,
  tone,
  value,
}) => (
  <label
    className={cn(
      'flex cursor-pointer items-center gap-3 rounded-[12px] border border-border-strong bg-sunken px-3.5 py-3 text-left transition-colors duration-[var(--dur-fast)]',
      'has-focus-visible:ring-2 has-focus-visible:ring-accent has-checked:border-[1.5px]',
      tones[tone],
    )}
  >
    <Radio className="sr-only" value={value} />
    <span className="choice-icon grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-fill text-muted">
      <HugeiconsIcon icon={icon} size={18} />
    </span>
    <span className="flex flex-col">
      <span className="text-sm font-semibold text-text">{title}</span>
      <span className="text-xs text-text-2">{description}</span>
    </span>
  </label>
);
