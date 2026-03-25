import { FC, ReactNode } from 'react';

import {
  FormDescription,
  FormError,
  useFormContext,
  useStoreState,
} from '@ariakit/react';
import {
  AlertCircleIcon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import clsx from 'clsx';

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
          'mt-1.5 flex items-start gap-1.5 text-xs font-medium text-red-600 dark:text-red-400',
        )}
      >
        <HugeiconsIcon
          icon={AlertCircleIcon}
          className="mt-0.5 shrink-0"
          size={14}
        />
        {error as ReactNode}
      </FormError>
    );
  }

  if (description) {
    return (
      <FormDescription
        name={name}
        className={clsx('mt-1.5 flex items-start gap-1.5 text-xs', {
          'text-slate-500 dark:text-slate-400': !disabled,
          'text-slate-400 opacity-75 dark:text-slate-500': disabled,
        })}
      >
        <HugeiconsIcon
          icon={InformationCircleIcon}
          className="mt-0.5 shrink-0"
          size={14}
        />
        {description}
      </FormDescription>
    );
  }

  return null;
};
