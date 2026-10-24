import type { FC, ReactNode } from 'react';

import {
  Alert01Icon,
  Alert02Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';
import { HugeiconsIcon } from '@hugeicons/react';

import { Heading } from '@/components/ui/Heading';
import { cn } from '@/utils/cn';

export type AlertVariant = 'danger' | 'info' | 'note' | 'success' | 'warning';

const variantStyles: Record<
  AlertVariant,
  {
    container: string;
    defaultIcon: IconSvgElement;
    icon: string;
  }
> = {
  danger: {
    container: 'bg-hp-soft border-hp/30 text-hp ',
    defaultIcon: Alert01Icon,
    icon: 'text-hp ',
  },
  info: {
    container: 'bg-mp-soft border-mp/30 text-mp ',
    defaultIcon: InformationCircleIcon,
    icon: 'text-mp ',
  },
  note: {
    container: 'bg-sunken border-border text-text-2 ',
    defaultIcon: InformationCircleIcon,
    icon: 'text-muted ',
  },
  success: {
    container: 'bg-ok-soft border-ok/30 text-ok ',
    defaultIcon: CheckmarkCircle02Icon,
    icon: 'text-ok ',
  },
  warning: {
    container: 'bg-xp-soft border-xp/30 text-xp ',
    defaultIcon: Alert02Icon,
    icon: 'text-xp ',
  },
};

export type AlertProps = {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  title?: string;
  variant?: AlertVariant;
};

export const Alert: FC<AlertProps> = ({
  children,
  className,
  icon,
  title,
  variant = 'note',
}) => {
  const styles = variantStyles[variant];

  const renderedIcon =
    icon === false ? null : icon ? (
      icon
    ) : (
      <HugeiconsIcon
        className={styles.icon}
        icon={styles.defaultIcon}
        size={20}
      />
    );

  return (
    <div
      className={cn(
        'relative flex gap-3 rounded-lg border p-4 text-sm',
        styles.container,
        className,
      )}
    >
      {renderedIcon && <div className="shrink-0 mt-0.5">{renderedIcon}</div>}
      <div className="flex-1 space-y-1">
        {!!title && (
          <Heading
            as="h5"
            className="font-bold leading-none text-inherit!"
            level={5}
            size="h4"
          >
            {title}
          </Heading>
        )}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
};
