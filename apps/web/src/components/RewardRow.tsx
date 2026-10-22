import type { FC, ReactNode } from 'react';

import type { BadgeProps } from '@/components/ui/Badge';
import { Badge } from '@/components/ui/Badge';
import { Content } from '@/components/ui/Content';

export type RewardRowProps = {
  action: string;
  badgeClassName?: string;
  badgeVariant?: BadgeProps['variant'];
  icon: ReactNode;
  reward: string;
};

export const RewardRow: FC<RewardRowProps> = ({
  action,
  badgeClassName,
  badgeVariant = 'primary',
  icon,
  reward,
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
