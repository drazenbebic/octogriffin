import type { FC, HTMLAttributes, ReactNode } from 'react';

import type { ChipTone } from '@/components/ui/Chip';
import { Chip } from '@/components/ui/Chip';

type BadgeVariant =
  'error' | 'info' | 'neutral' | 'primary' | 'success' | 'warning';

const tones: Record<BadgeVariant, ChipTone> = {
  error: 'hp',
  info: 'mp',
  neutral: 'neutral',
  primary: 'accent',
  success: 'ok',
  warning: 'xp',
};

export type BadgeProps = {
  children: ReactNode;
  hasDot?: boolean;
  pulsing?: boolean;
  shape?: 'pill' | 'square';
  size?: 'md' | 'sm';
  variant?: BadgeVariant;
} & HTMLAttributes<HTMLSpanElement>;

/** @deprecated Use Chip. Removed once the remaining pages are migrated. */
export const Badge: FC<BadgeProps> = ({
  children,
  hasDot = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars -- dropped, Chip has no pulse
  pulsing: _pulsing,
  shape = 'pill',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars -- dropped, Chip has one size
  size: _size,
  variant = 'neutral',
  ...props
}) => (
  <Chip dot={hasDot} shape={shape} tone={tones[variant]} {...props}>
    {children}
  </Chip>
);
