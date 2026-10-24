import type { ElementType, FC, ReactNode } from 'react';

import type { CheckboxProps } from '@ariakit/react';
import { Checkbox } from '@ariakit/react';

import { cn } from '@/utils/cn';

export type SwitchProps = {
  as?: ElementType;
  containerClassName?: string;
  description?: ReactNode;
  label?: ReactNode;
} & CheckboxProps;

export const Switch: FC<SwitchProps> = ({
  as: Tag = Checkbox,
  className,
  containerClassName,
  description,
  disabled,
  label,
  ...props
}) => {
  return (
    <label
      className={cn(
        'group flex items-start gap-3',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        containerClassName,
      )}
    >
      <div className="relative flex h-6 items-center">
        <Tag
          className={cn('peer sr-only', className)}
          disabled={disabled}
          {...props}
        />

        <div
          className={cn(
            'h-6 w-10 rounded-full border border-border-strong bg-fill transition-colors duration-[var(--dur-fast)]',
            'peer-checked:border-accent peer-checked:bg-accent',
            'peer-focus-visible:ring-4 peer-focus-visible:ring-ring',
            'group-hover:peer-checked:bg-accent-hover group-hover:bg-border-strong ',
          )}
        />

        <div
          className={cn(
            'absolute top-[3px] left-[3px] h-[18px] w-[18px] rounded-full bg-muted transition-[translate,background-color] duration-[var(--dur-fast)] peer-checked:bg-white',
            'peer-checked:translate-x-4',
          )}
        />
      </div>

      {(label || description) && (
        <div className="flex flex-col select-none">
          {label && (
            <span className="text-sm font-medium text-text group-active:text-accent-text ">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-muted ">{description}</span>
          )}
        </div>
      )}
    </label>
  );
};
