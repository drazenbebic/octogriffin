import { forwardRef, ReactNode, useState } from 'react';

import { FormInput as BaseFormInput } from '@ariakit/react';
import clsx from 'clsx';
import { ViewIcon, ViewOffIcon } from 'hugeicons-react';

import { ButtonIcon } from '@/components/ui/ButtonIcon';
import { FormFeedback } from '@/components/ui/FormFeedback';
import { FormLabel } from '@/components/ui/FormLabel';

export type FormInputProps = {
  className?: string;
  description?: string;
  disabled?: boolean;
  label?: string | ReactNode;
  name: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'phone' | 'number' | 'url';
  leadingIcon?: ReactNode;
};

const baseStyles =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 transition-all duration-200 ease-in-out focus:bg-white focus:border-violet-600 focus:outline-none focus:ring-4 focus:ring-violet-600/10 disabled:opacity-50 disabled:pointer-events-none';

const errorStyles =
  'aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/10 aria-invalid:bg-red-50/50';

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      className,
      description,
      disabled = false,
      label,
      name,
      placeholder,
      readOnly = false,
      required = false,
      type = 'text',
      leadingIcon,
      ...props
    },
    ref,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPasswordType = type === 'password';
    const inputType = isPasswordType
      ? isPasswordVisible
        ? 'text'
        : 'password'
      : type;

    return (
      <div className={clsx('w-full', className)}>
        {!!label && (
          <FormLabel name={name} isRequired={required}>
            {label}
          </FormLabel>
        )}

        <div className="relative">
          {leadingIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leadingIcon}
            </div>
          )}

          <BaseFormInput
            ref={ref}
            name={name}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            className={clsx(baseStyles, errorStyles, {
              'pl-10': !!leadingIcon,
              'pr-10': isPasswordType,
            })}
            {...props}
          />

          {isPasswordType && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <ButtonIcon
                size="sm"
                variant="ghost"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
              >
                {isPasswordVisible ? (
                  <ViewOffIcon size={18} />
                ) : (
                  <ViewIcon size={18} />
                )}
              </ButtonIcon>
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
