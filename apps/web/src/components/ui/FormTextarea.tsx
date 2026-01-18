import { forwardRef } from 'react';

import { FormInput, useFormContext, useStoreState } from '@ariakit/react';
import clsx from 'clsx';

import { FormFeedback } from '@/components/ui/FormFeedback';
import { FormLabel } from '@/components/ui/FormLabel';

export interface FormTextareaProps {
  className?: string;
  description?: string;
  disabled?: boolean;
  label?: string;
  maxLength?: number;
  name: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

const baseStyles =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 transition-all duration-200 ease-in-out focus:bg-white focus:border-violet-600 focus:outline-none focus:ring-4 focus:ring-violet-600/10 disabled:opacity-50 disabled:pointer-events-none';

const errorStyles =
  'aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/10 aria-invalid:bg-red-50/50';

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      className,
      description,
      disabled = false,
      label,
      maxLength,
      name,
      placeholder,
      required = false,
      rows = 3,
      ...props
    },
    ref,
  ) => {
    const form = useFormContext();
    const value = useStoreState(form, state => state?.values[name] ?? '');

    return (
      <div className={clsx('w-full', className)}>
        {!!label && (
          <FormLabel name={name} isRequired={required}>
            {label}
          </FormLabel>
        )}

        <div className="relative">
          <FormInput
            // @ts-expect-error type mismatch
            ref={ref}
            name={name}
            render={<textarea rows={rows} />}
            className={clsx(baseStyles, errorStyles)}
            disabled={disabled}
            maxLength={maxLength}
            placeholder={placeholder}
            required={required}
            {...props}
          />
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <FormFeedback
              description={description}
              disabled={disabled}
              name={name}
            />
          </div>

          {!!maxLength && (
            <div
              className={clsx('mt-1.5 shrink-0 text-xs font-medium', {
                'text-slate-400': !disabled,
                'text-slate-300': disabled,
                'text-red-500': value.length >= maxLength,
              })}
            >
              {value.length} / {maxLength}
            </div>
          )}
        </div>
      </div>
    );
  },
);

FormTextarea.displayName = 'FormTextarea';
