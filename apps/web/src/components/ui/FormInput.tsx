import type { ReactNode } from 'react';
import { forwardRef, useState } from 'react';

import { FormInput as BaseFormInput } from '@ariakit/react';
import { ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons';

import { ButtonIcon } from '@/components/ui/ButtonIcon';
import { FormFeedback } from '@/components/ui/FormFeedback';
import { FormLabel } from '@/components/ui/FormLabel';
import { cn } from '@/utils/cn';

export type FormInputProps = {
  className?: string;
  description?: string;
  disabled?: boolean;
  /** Classes for the input itself; `className` styles the wrapper. */
  inputClassName?: string;
  label?: ReactNode | string;
  leadingIcon?: ReactNode;
  min?: number;
  name: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  /** What the show/hide button reveals, e.g. "token". */
  revealLabel?: string;
  type?: 'email' | 'number' | 'password' | 'phone' | 'text' | 'url';
};

const baseStyles =
  'h-10 w-full rounded-md border border-border-strong bg-sunken px-3 text-sm text-text placeholder:text-faint transition-colors duration-[var(--dur-fast)] focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-ring disabled:opacity-50 disabled:pointer-events-none ';

const errorStyles =
  'aria-invalid:border-hp aria-invalid:focus:border-hp aria-invalid:focus:ring-hp/20 aria-invalid:bg-hp-soft ';

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      className,
      description,
      disabled = false,
      inputClassName,
      label,
      leadingIcon,
      name,
      placeholder,
      readOnly = false,
      required = false,
      revealLabel = 'password',
      type = 'text',
      ...props
    },
    ref,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPasswordType = type === 'password';
    const inputType = isPasswordType && isPasswordVisible ? 'text' : type;

    return (
      <div className={cn('w-full', className)}>
        {!!label && (
          <FormLabel isRequired={required} name={name}>
            {label}
          </FormLabel>
        )}

        <div className="relative">
          {leadingIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              {leadingIcon}
            </div>
          )}

          <BaseFormInput
            className={cn(
              baseStyles,
              errorStyles,
              {
                'pl-10': !!leadingIcon,
                'pr-11': isPasswordType,
              },
              inputClassName,
            )}
            disabled={disabled}
            name={name}
            placeholder={placeholder}
            readOnly={readOnly}
            ref={ref}
            required={required}
            type={inputType}
            {...props}
          />

          {isPasswordType && (
            <div className="absolute top-1/2 right-1 -translate-y-1/2">
              <ButtonIcon
                className="h-8 w-8"
                icon={isPasswordVisible ? ViewOffIcon : ViewIcon}
                label={`${isPasswordVisible ? 'Hide' : 'Show'} ${revealLabel}`}
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                size="sm"
              />
            </div>
          )}
        </div>

        <FormFeedback
          description={description}
          disabled={disabled}
          name={name}
        />
      </div>
    );
  },
);

FormInput.displayName = 'FormInput';
