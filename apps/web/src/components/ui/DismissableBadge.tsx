import { FC, ReactNode } from 'react';

import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Badge, BadgeProps } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

export type DismissableBadgeProps = Omit<BadgeProps, 'children'> & {
  children: ReactNode;
  onDismiss: () => void;
  dismissLabel: string;
};

const iconSizes: Record<NonNullable<BadgeProps['size']>, number> = {
  sm: 12,
  md: 14,
};

export const DismissableBadge: FC<DismissableBadgeProps> = ({
  children,
  onDismiss,
  dismissLabel,
  size = 'sm',
  className,
  ...badgeProps
}) => (
  <Badge className={cn('pr-1', className)} size={size} {...badgeProps}>
    {children}
    <button
      aria-label={dismissLabel}
      className="-mr-0.5 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full p-0.5 text-current/70 transition-colors hover:bg-black/10 hover:text-current focus:outline-none focus-visible:ring-1 focus-visible:ring-current dark:hover:bg-white/10"
      onClick={onDismiss}
      type="button"
    >
      <HugeiconsIcon
        aria-hidden="true"
        icon={Cancel01Icon}
        size={iconSizes[size]}
      />
    </button>
  </Badge>
);
