import NextLink from 'next/link';
import type { FC, ReactNode } from 'react';

import type { HugeiconsIconProps } from '@hugeicons/react';
import { HugeiconsIcon } from '@hugeicons/react';

import type { ButtonProps } from '@/components/ui/Button';
import { Button } from '@/components/ui/Button';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { cn } from '@/utils/cn';

type ButtonSize = NonNullable<ButtonProps['size']>;

export type CalloutProps = {
  button: {
    href: string;
    icon?: HugeiconsIconProps['icon'];
    isExternal?: boolean;
    label: string;
    size?: ButtonSize;
    variant?: ButtonProps['variant'];
  };
  className?: string;
  description: ReactNode;
  headingLevel?: 2 | 3;
  title: string;
};

const iconSizes: Record<ButtonSize, number> = {
  lg: 20,
  md: 18,
  sm: 14,
};

export const Callout: FC<CalloutProps> = ({
  button,
  className,
  description,
  headingLevel = 2,
  title,
}) => {
  const size = button.size ?? 'md';

  return (
    <div
      className={cn(
        'rounded-3xl bg-slate-50 ring-1 ring-slate-100 p-8 text-center dark:bg-slate-900 dark:ring-slate-800',
        className,
      )}
    >
      <Heading className="mb-2" level={headingLevel} size="lg">
        {title}
      </Heading>
      <Content className="mb-6">{description}</Content>
      <NextLink
        href={button.href}
        rel={button.isExternal ? 'noopener noreferrer' : undefined}
        target={button.isExternal ? '_blank' : undefined}
      >
        <Button size={size} variant={button.variant ?? 'secondary'}>
          {button.icon && (
            <HugeiconsIcon icon={button.icon} size={iconSizes[size]} />
          )}
          {button.label}
        </Button>
      </NextLink>
    </div>
  );
};
