import { ElementType, FC, ReactNode } from 'react';

import { Checkbox, CheckboxProps } from '@ariakit/react';
import clsx from 'clsx';

export type SwitchProps = CheckboxProps & {
  as?: ElementType;
  label?: ReactNode;
  description?: ReactNode;
  containerClassName?: string;
};

export const Switch: FC<SwitchProps> = ({
  as: Tag = Checkbox,
  className,
  containerClassName,
  label,
  description,
  disabled,
  ...props
}) => {
  return (
    <label
      className={clsx(
        'group flex items-start gap-3',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        containerClassName,
      )}
    >
      <div className="relative flex h-6 items-center">
        <Tag
          className={clsx('peer sr-only', className)}
          disabled={disabled}
          {...props}
        />

        <div
          className={clsx(
            'h-6 w-11 rounded-full bg-slate-200 transition-colors duration-200 ease-in-out',
            'peer-checked:bg-violet-600',
            'peer-focus-visible:ring-4 peer-focus-visible:ring-violet-500/20',
            'group-hover:peer-checked:bg-violet-700 group-hover:bg-slate-300',
          )}
        />

        <div
          className={clsx(
            'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out',
            'peer-checked:translate-x-5',
          )}
        />
      </div>

      {(label || description) && (
        <div className="flex flex-col select-none">
          {label && (
            <span className="text-sm font-medium text-slate-900 group-active:text-violet-700">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-500">{description}</span>
          )}
        </div>
      )}
    </label>
  );
};
