import {
  Children,
  FocusEvent,
  FocusEventHandler,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  useMemo,
  useRef,
} from 'react';

import {
  Select as BaseSelect,
  SelectArrow,
  SelectPopover,
  SelectProps as BaseSelectProps,
  SelectProvider,
  useSelectStore,
  useStoreState,
} from '@ariakit/react';
import clsx from 'clsx';
import { ArrowDown01Icon } from 'hugeicons-react';

import { SelectItemProps } from '@/components/ui/SelectItem';

export type SelectProps = BaseSelectProps & {
  value?: string | string[];
  setValue?: (value: string | string[]) => void;
  defaultValue?: string | string[];
  onBlur?: FocusEventHandler<HTMLElement>;
  multiple?: boolean;
  placeholder?: string;
};

const triggerStyles =
  'cursor-pointer relative flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-left text-slate-900 transition-all duration-200 ease-in-out focus:bg-white focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-600/10 disabled:opacity-50 disabled:pointer-events-none hover:bg-slate-100';

const popoverStyles =
  'z-50 max-h-[300px] min-w-[180px] overflow-auto rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none';

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
    if (label || !isValidElement(child)) return;

    const element = child as ReactElement<SelectItemProps>;
    const props = element.props;

    if ('value' in props && String(props.value) === String(singleValue)) {
      label = props.children;
    } else if (props.children) {
      const nestedLabel = getSelectedLabel(props.children, singleValue, false);
      if (nestedLabel) label = nestedLabel;
    }
  });

  return label;
};

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      children,
      className,
      value,
      setValue,
      defaultValue,
      multiple = false,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const select = useSelectStore({ value, setValue, defaultValue });
    const portalRef = useRef<HTMLDivElement>(null);
    const selectValue = useStoreState(select, 'value');

    const selectedLabel = useMemo(
      () =>
        getSelectedLabel(children, selectValue as string | string[], multiple),
      [children, selectValue, multiple],
    );

    const onBlur = (event: FocusEvent<HTMLElement>) => {
      const portal = portalRef.current;
      const { selectElement, popoverElement } = select.getState();

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
          store={select}
          onBlur={onBlur}
          className={clsx(triggerStyles, className)}
        >
          <span className="truncate">
            {hasValue ? (
              selectedLabel || selectValue
            ) : (
              <span className="text-slate-400">
                {placeholder || 'Select an item'}
              </span>
            )}
          </span>

          <SelectArrow>
            <ArrowDown01Icon className="h-4 w-4 text-slate-400" />
          </SelectArrow>
        </BaseSelect>

        <SelectPopover
          store={select}
          modal
          sameWidth
          gutter={8}
          onBlur={onBlur}
          portalRef={portalRef}
          className={popoverStyles}
        >
          {children}
        </SelectPopover>
      </SelectProvider>
    );
  },
);

Select.displayName = 'Select';
