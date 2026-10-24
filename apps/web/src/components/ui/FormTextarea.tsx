import { forwardRef } from 'react';

import { FormInput, useFormContext, useStoreState } from '@ariakit/react';

import { FormFeedback } from '@/components/ui/FormFeedback';
import { FormLabel } from '@/components/ui/FormLabel';
import { cn } from '@/utils/cn';

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
  'w-full rounded-md border border-border-strong bg-sunken px-3 py-2.5 text-sm text-text placeholder:text-faint transition-colors duration-[var(--dur-fast)] focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-ring disabled:pointer-events-none disabled:opacity-50';

const errorStyles =
  'aria-invalid:border-hp aria-invalid:focus:border-hp aria-invalid:focus:ring-hp/20 aria-invalid:bg-hp-soft ';

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
      <div className={cn('w-full', className)}>
        {!!label && (
          <FormLabel isRequired={required} name={name}>
            {label}
          </FormLabel>
        )}

        <div className="relative">
          <FormInput
            className={cn(baseStyles, errorStyles)}
            disabled={disabled}
            maxLength={maxLength}
            name={name}
            placeholder={placeholder}
            // @ts-expect-error type mismatch
            ref={ref}
            render={<textarea rows={rows} />}
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
              className={cn('mt-1.5 shrink-0 font-mono text-xs', {
                'text-hp ': value.length >= maxLength,
                'text-muted ': disabled,
                'text-muted': !disabled,
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
