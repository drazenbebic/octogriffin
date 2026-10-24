'use client';

import { useFormContext, useStoreState } from '@ariakit/react';

import { FormFeedback } from '@/components/ui/FormFeedback';
import type {
  SegmentedControlProps,
  SegmentOption,
} from '@/components/ui/SegmentedControl';
import { SegmentedControl } from '@/components/ui/SegmentedControl';

export type FormSegmentedControlProps<V extends string> = {
  description?: string;
  label: string;
  name: string;
  options: SegmentOption<V>[];
} & Pick<SegmentedControlProps<V>, 'className' | 'size'>;

/** A SegmentedControl bound to the surrounding Ariakit form by `name`. */
export const FormSegmentedControl = <V extends string>({
  description,
  name,
  ...props
}: FormSegmentedControlProps<V>) => {
  const form = useFormContext();
  const value = useStoreState(form, state => String(state?.values[name] ?? ''));

  return (
    <div className="flex flex-col">
      <SegmentedControl
        {...props}
        onChange={next => form?.setValue(name, next)}
        value={value as V}
      />
      <FormFeedback description={description} name={name} />
    </div>
  );
};
