import { FC, ReactNode } from 'react';

import clsx from 'clsx';
import {
  Alert01Icon,
  Alert02Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from 'hugeicons-react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger' | 'note';

const variantStyles: Record<
  AlertVariant,
  {
    container: string;
    icon: string;
    defaultIcon: FC<Record<string, string | number>>;
  }
> = {
  info: {
    container:
      'bg-blue-50 border-blue-100 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100',
    icon: 'text-blue-600 dark:text-blue-400',
    defaultIcon: InformationCircleIcon,
  },
  success: {
    container:
      'bg-emerald-50 border-emerald-100 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-100',
    icon: 'text-emerald-600 dark:text-emerald-400',
    defaultIcon: CheckmarkCircle02Icon,
  },
  warning: {
    container:
      'bg-amber-50 border-amber-100 text-amber-900 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-100',
    icon: 'text-amber-600 dark:text-amber-400',
    defaultIcon: Alert02Icon,
  },
  danger: {
    container:
      'bg-red-50 border-red-100 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100',
    icon: 'text-red-600 dark:text-red-400',
    defaultIcon: Alert01Icon,
  },
  note: {
    container:
      'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200',
    icon: 'text-slate-500 dark:text-slate-400',
    defaultIcon: InformationCircleIcon,
  },
};

export type AlertProps = {
  title?: string;
  children: ReactNode;
  variant?: AlertVariant;
  className?: string;
  icon?: ReactNode;
};

export const Alert: FC<AlertProps> = ({
  title,
  children,
  variant = 'note',
  className,
  icon,
}) => {
  const styles = variantStyles[variant];
  const IconComponent = styles.defaultIcon;

  const renderedIcon =
    icon === false ? null : icon ? (
      icon
    ) : (
      <IconComponent size={20} className={styles.icon} variant="bulk" />
    );

  return (
    <div
      className={clsx(
        'relative flex gap-3 rounded-lg border p-4 text-sm',
        styles.container,
        className,
      )}
    >
      {renderedIcon && <div className="shrink-0 mt-0.5">{renderedIcon}</div>}
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-bold leading-none">{title}</h5>}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
};
