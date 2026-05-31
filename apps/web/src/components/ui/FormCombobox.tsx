import { FC, forwardRef } from 'react';

import { FormControl, useFormContext, useStoreState } from '@ariakit/react';

import { Combobox, ComboboxProps } from '@/components/ui/Combobox';
import { FormFeedback } from '@/components/ui/FormFeedback';
import { FormLabel } from '@/components/ui/FormLabel';
import { cn } from '@/utils/cn';

export type FormComboboxProps = Omit<
  ComboboxProps,
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
  'aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/10 aria-invalid:bg-red-50/50';

export const FormCombobox: FC<FormComboboxProps> = forwardRef(
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
    const value = useStoreState(form, state => state?.values[name] ?? '');

    return (
      <div className={cn('w-full', className)}>
        {!!label && (
          <FormLabel name={name} isRequired={required}>
            {label}
          </FormLabel>
        )}

        <FormControl
          name={name}
          render={
            <Combobox
              // @ts-expect-error - Type mismatch
              ref={ref}
              items={items}
              defaultValue={value}
              onChangeAction={val => form?.setValue(name, val)}
              placeholder={placeholder}
              required={required}
              className={cn(errorStyles, className)}
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

FormCombobox.displayName = 'FormCombobox';
