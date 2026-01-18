import { FC, ReactNode } from 'react';

import {
  FormDescription,
  FormError,
  useFormContext,
  useStoreState,
} from '@ariakit/react';
import clsx from 'clsx';
import { AlertCircleIcon, InformationCircleIcon } from 'hugeicons-react';

export interface FormFeedbackProps {
  description?: string;
  disabled?: boolean;
  name: string;
}

export const FormFeedback: FC<FormFeedbackProps> = ({
  description,
  disabled,
  name,
}) => {
  const form = useFormContext();
  const error = useStoreState(form, state => state?.errors[name]);
  const touched = useStoreState(form, state => state?.touched[name]);

  if (error && touched) {
    return (
      <FormError
        name={name}
        className={clsx(
          'mt-1.5 flex items-start gap-1.5 text-xs font-medium text-red-600',
        )}
      >
        <AlertCircleIcon className="mt-0.5 shrink-0" size={14} />
        {error as ReactNode}
      </FormError>
    );
  }

  if (description) {
    return (
      <FormDescription
        name={name}
        className={clsx('mt-1.5 flex items-start gap-1.5 text-xs', {
          'text-slate-500': !disabled,
          'text-slate-400 opacity-75': disabled,
        })}
      >
        <InformationCircleIcon className="mt-0.5 shrink-0" size={14} />
        {description}
      </FormDescription>
    );
  }

  return null;
};
