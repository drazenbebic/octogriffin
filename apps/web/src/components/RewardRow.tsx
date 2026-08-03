import { FC, ReactNode } from 'react';

import { Badge, BadgeProps } from '@/components/ui/Badge';
import { Content } from '@/components/ui/Content';

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
  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800">
    <div className="flex items-center gap-3">
      {icon}
      <Content as="span" className="font-medium">
        {action}
      </Content>
    </div>

    <Badge className={badgeClassName} size="md" variant={badgeVariant}>
      {reward}
    </Badge>
  </div>
);
