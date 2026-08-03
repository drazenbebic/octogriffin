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
    'onChangeAction' | 'defaultValue'
  >;

type FormComboboxMultipleProps = FormComboboxOwnProps &
  Omit<
    Extract<ComboboxProps, { multiple: true }>,
    'onChangeAction' | 'defaultValue'
  >;

export type FormComboboxProps =
  FormComboboxSingleProps | FormComboboxMultipleProps;

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
        ref={ref}
        multiple
        items={props.items}
        defaultValue={value as string[]}
        onChangeAction={val => form?.setValue(props.name, val)}
        placeholder={props.placeholder}
        required={props.required}
        disabled={props.disabled}
        disableLabel
      />
    ) : (
      <Combobox
        ref={ref}
        items={props.items}
        defaultValue={value as string}
        onChangeAction={val => form?.setValue(props.name, val)}
        placeholder={props.placeholder}
        required={props.required}
        disabled={props.disabled}
        disableLabel
      />
    );

    return (
      <div className={cn('w-full', props.className)}>
        {!!props.label && (
          <FormLabel name={props.name} isRequired={props.required}>
            {props.label}
          </FormLabel>
        )}

        <FormControl name={props.name} render={renderCombobox} />

        <FormFeedback
          name={props.name}
          description={props.description}
          disabled={props.disabled}
        />
      </div>
    );
  },
);

FormCombobox.displayName = 'FormCombobox';
