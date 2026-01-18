import { FC, ReactNode } from 'react';

import { Badge, BadgeProps } from '@/components/ui/Badge';

export type RewardRowProps = {
  icon: ReactNode;
  action: string;
  reward: string;
  badgeClassName?: string;
  badgeVariant?: BadgeProps['variant'];
};

export const RewardRow: FC<RewardRowProps> = ({
  icon,
  action,
  reward,
  badgeClassName,
  badgeVariant = 'primary',
}) => (
  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100">
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-medium text-slate-700">{action}</span>
    </div>
    <Badge className={badgeClassName} variant={badgeVariant} size="md">
      {reward}
    </Badge>
  </div>
);
