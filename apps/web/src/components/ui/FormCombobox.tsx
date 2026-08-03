import { forwardRef } from 'react';

import { FormControl, useFormContext, useStoreState } from '@ariakit/react';

import { Combobox, ComboboxProps } from '@/components/ui/Combobox';
import { FormFeedback } from '@/components/ui/FormFeedback';
import { FormLabel } from '@/components/ui/FormLabel';
import { cn } from '@/utils/cn';

type FormComboboxOwnProps = {
  label?: string;
  name: string;
  description?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
};

type FormComboboxSingleProps = FormComboboxOwnProps &
  Omit<
    Extract<ComboboxProps, { multiple?: false }>,
    'defaultValue' | 'onChangeAction'
  >;

type FormComboboxMultipleProps = FormComboboxOwnProps &
  Omit<
    Extract<ComboboxProps, { multiple: true }>,
    'defaultValue' | 'onChangeAction'
  >;

export type FormComboboxProps =
  FormComboboxMultipleProps | FormComboboxSingleProps;

export const FormCombobox = forwardRef<HTMLInputElement, FormComboboxProps>(
  (props, ref) => {
    const form = useFormContext();
    const value = useStoreState(form, state =>
      props.multiple
        ? ((state?.values[props.name] as string[] | undefined) ?? [])
        : ((state?.values[props.name] as string | undefined) ?? ''),
    );

    const renderCombobox = props.multiple ? (
      <Combobox
        defaultValue={value as string[]}
        disabled={props.disabled}
        disableLabel
        items={props.items}
        multiple
        onChangeAction={val => form?.setValue(props.name, val)}
        placeholder={props.placeholder}
        ref={ref}
        required={props.required}
      />
    ) : (
      <Combobox
        defaultValue={value as string}
        disabled={props.disabled}
        disableLabel
        items={props.items}
        onChangeAction={val => form?.setValue(props.name, val)}
        placeholder={props.placeholder}
        ref={ref}
        required={props.required}
      />
    );

    return (
      <div className={cn('w-full', props.className)}>
        {!!props.label && (
          <FormLabel isRequired={props.required} name={props.name}>
            {props.label}
          </FormLabel>
        )}

        <FormControl name={props.name} render={renderCombobox} />

        <FormFeedback
          description={props.description}
          disabled={props.disabled}
          name={props.name}
        />
      </div>
    );
  },
);

FormCombobox.displayName = 'FormCombobox';
