import type { FC } from 'react';
import { forwardRef } from 'react';

import { FormControl, useFormContext, useStoreState } from '@ariakit/react';

import { FormLabel } from '@/components/ui/FormLabel';
import type { SelectProps } from '@/components/ui/Select';
import { Select } from '@/components/ui/Select';
import { cn } from '@/utils/cn';

import { FormFeedback } from './FormFeedback';

export type FormSelectProps = {
  className?: string;
  description?: string;
  label?: string;
  multiple?: boolean;
  name: string;
  placeholder?: string;
} & Omit<SelectProps, 'setValue' | 'value'>;

const errorStyles =
  'aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/10 aria-invalid:bg-red-50/50 dark:aria-invalid:bg-red-900/10 dark:aria-invalid:border-red-900/50';

export const FormSelect: FC<FormSelectProps> = forwardRef(
  (
    {
      className,
      description,
      disabled,
      label,
      multiple,
      name,
      placeholder,
      required,
      ...props
    },
    ref,
  ) => {
    const defaultValue = multiple ? [] : '';
    const form = useFormContext();
    const value = useStoreState(
      form,
      state => state?.values[name] ?? defaultValue,
    );

    return (
      <div className={cn('w-full', className)}>
        {!!label && (
          <FormLabel isRequired={required} name={name}>
            {label}
          </FormLabel>
        )}

        <FormControl
          name={name}
          render={
            <Select
              className={errorStyles}
              disabled={disabled}
              multiple={multiple}
              placeholder={placeholder}
              ref={ref}
              required={required}
              setValue={val => form?.setValue(name, val)}
              value={value}
              {...props}
            />
          }
        />

        <FormFeedback
          description={description}
          disabled={disabled}
          name={name}
        />
      </div>
    );
  },
);

FormSelect.displayName = 'FormSelect';
