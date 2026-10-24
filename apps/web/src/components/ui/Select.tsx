import type {
  FocusEvent,
  FocusEventHandler,
  ReactElement,
  ReactNode,
} from 'react';
import { Children, forwardRef, isValidElement, useMemo, useRef } from 'react';

import type { SelectProps as BaseSelectProps } from '@ariakit/react';
import {
  Select as BaseSelect,
  SelectArrow,
  SelectPopover,
  SelectProvider,
  useSelectStore,
  useStoreState,
} from '@ariakit/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import type { SelectItemProps } from '@/components/ui/SelectItem';
import { cn } from '@/utils/cn';

export type SelectProps = BaseSelectProps & {
  defaultValue?: string | string[];
  multiple?: boolean;
  onBlur?: FocusEventHandler<HTMLElement>;
  placeholder?: string;
  setValue?: (value: string | string[]) => void;
  value?: string | string[];
};

const triggerStyles =
  'cursor-pointer relative flex h-10 w-full items-center justify-between rounded-md border border-border-strong bg-sunken px-3 text-left text-sm text-text transition-colors duration-[var(--dur-fast)] focus:bg-sunken focus:border-accent focus:outline-none focus:ring-4 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none hover:bg-fill ';

const popoverStyles =
  'z-50 max-h-[300px] min-w-[180px] overflow-auto rounded-md border border-border bg-raised p-1.5 shadow-e2 focus:outline-none ';

const getSelectedLabel = (
  children: ReactNode,
  value: string | string[] | undefined,
  multiple: boolean,
): ReactNode | undefined => {
  if (value === undefined || (Array.isArray(value) && value.length === 0)) {
    return undefined;
  }

  if (multiple) {
    const count = Array.isArray(value) ? value.length : 1;

    return `${count} item${count === 1 ? '' : 's'} selected`;
  }

  const singleValue = Array.isArray(value) ? value[0] : value;
  let label: ReactNode | undefined;

  Children.forEach(children, child => {
    if (label || !isValidElement(child)) {
      return;
    }

    const element = child as ReactElement<SelectItemProps>;
    const props = element.props;

    if ('value' in props && String(props.value) === String(singleValue)) {
      label = props.children;
    } else if (props.children) {
      const nestedLabel = getSelectedLabel(props.children, singleValue, false);

      if (nestedLabel) {
        label = nestedLabel;
      }
    }
  });

  return label;
};

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      children,
      className,
      defaultValue,
      multiple = false,
      placeholder,
      setValue,
      value,
      ...props
    },
    ref,
  ) => {
    const select = useSelectStore({ defaultValue, setValue, value });
    const portalRef = useRef<HTMLDivElement>(null);
    const selectValue = useStoreState(select, 'value');

    const selectedLabel = useMemo(
      () =>
        getSelectedLabel(children, selectValue as string | string[], multiple),
      [children, selectValue, multiple],
    );

    const onBlur = (event: FocusEvent<HTMLElement>) => {
      const portal = portalRef.current;
      const { popoverElement, selectElement } = select.getState();

      if (
        portal?.contains(event.relatedTarget) ||
        selectElement?.contains(event.relatedTarget) ||
        popoverElement?.contains(event.relatedTarget)
      ) {
        return;
      }

      props.onBlur?.(event);
    };

    const hasValue = useMemo(() => {
      if (
        selectValue === undefined ||
        selectValue === null ||
        selectValue === ''
      ) {
        return false;
      }

      if (Array.isArray(selectValue) && selectValue.length === 0) {
        return false;
      }

      return true;
    }, [selectValue]);

    return (
      <SelectProvider store={select}>
        <BaseSelect
          ref={ref}
          {...props}
          className={cn(triggerStyles, className)}
          onBlur={onBlur}
          store={select}
        >
          <span className="truncate">
            {hasValue ? (
              selectedLabel || selectValue
            ) : (
              <span className="text-muted">
                {placeholder || 'Select an item'}
              </span>
            )}
          </span>

          <SelectArrow>
            <HugeiconsIcon
              className="h-4 w-4 text-muted"
              icon={ArrowDown01Icon}
            />
          </SelectArrow>
        </BaseSelect>

        <SelectPopover
          className={popoverStyles}
          gutter={8}
          modal
          onBlur={onBlur}
          portalRef={portalRef}
          sameWidth
          store={select}
        >
          {children}
        </SelectPopover>
      </SelectProvider>
    );
  },
);

Select.displayName = 'Select';
