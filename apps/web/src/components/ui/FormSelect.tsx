import { FC, forwardRef } from 'react';

import { FormControl, useFormContext, useStoreState } from '@ariakit/react';
import clsx from 'clsx';

import { FormLabel } from '@/components/ui/FormLabel';
import { Select, SelectProps } from '@/components/ui/Select';

import { FormFeedback } from './FormFeedback';

export type FormSelectProps = Omit<SelectProps, 'value' | 'setValue'> & {
  label?: string;
  name: string;
  description?: string;
  className?: string;
  placeholder?: string;
  multiple?: boolean;
};

const errorStyles =
  'aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/10 aria-invalid:bg-red-50/50';

export const FormSelect: FC<FormSelectProps> = forwardRef(
  (
    {
      name,
      label,
      description,
      className,
      required,
      disabled,
      placeholder,
      multiple,
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
      <div className={clsx('w-full', className)}>
        {!!label && (
          <FormLabel name={name} isRequired={required}>
            {label}
          </FormLabel>
        )}

        <FormControl
          name={name}
          render={
            <Select
              ref={ref}
              value={value}
              setValue={val => form?.setValue(name, val)}
              disabled={disabled}
              required={required}
              multiple={multiple}
              placeholder={placeholder}
              className={clsx(errorStyles, className)}
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

FormSelect.displayName = 'FormSelect';
