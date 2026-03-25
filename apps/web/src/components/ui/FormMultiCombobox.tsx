import { FC, forwardRef } from 'react';

import { FormControl, useFormContext, useStoreState } from '@ariakit/react';
import clsx from 'clsx';

import { FormFeedback } from '@/components/ui/FormFeedback';
import { FormLabel } from '@/components/ui/FormLabel';
import {
  MultiCombobox,
  MultiComboboxProps,
} from '@/components/ui/MultiCombobox';

export type FormMultiComboboxProps = Omit<
  MultiComboboxProps,
  'onChangeAction' | 'selectedValues'
> & {
  label?: string;
  name: string;
  description?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
};

const errorStyles =
  'aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/10 aria-invalid:bg-red-50/50 dark:aria-invalid:bg-red-900/10 dark:aria-invalid:border-red-900/50';

export const FormMultiCombobox: FC<FormMultiComboboxProps> = forwardRef(
  (
    {
      name,
      label,
      description,
      className,
      required,
      disabled,
      placeholder,
      items,
      ...props
    },
    ref,
  ) => {
    const form = useFormContext();
    const value = useStoreState(form, state => state?.values[name] ?? []);

    return (
      <div className={clsx('w-full', className)}>
        {!!label && (
          <FormLabel name={name} isRequired={required}>
            {label}
          </FormLabel>
        )}

        <FormControl
          name={name}
          render={
            <MultiCombobox
              // @ts-expect-error - Type mismatch
              ref={ref}
              items={items}
              defaultValue={value}
              onChangeAction={val => form?.setValue(name, val)}
              placeholder={placeholder}
              required={required}
              className={errorStyles}
              disableLabel
              {...props}
            />
          }
        />

        <FormFeedback
          name={name}
          description={description}
          disabled={disabled}
        />
      </div>
    );
  },
);

FormMultiCombobox.displayName = 'FormMultiCombobox';
