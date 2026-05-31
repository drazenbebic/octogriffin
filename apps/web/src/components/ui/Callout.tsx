import { FC, ReactNode } from 'react';
import NextLink from 'next/link';

import { HugeiconsIcon, HugeiconsIconProps } from '@hugeicons/react';

import { Button, ButtonProps } from '@/components/ui/Button';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { cn } from '@/utils/cn';

type ButtonSize = NonNullable<ButtonProps['size']>;

export type CalloutProps = {
  title: string;
  description: ReactNode;
  button: {
    label: string;
    href: string;
    icon?: HugeiconsIconProps['icon'];
    variant?: ButtonProps['variant'];
    size?: ButtonSize;
    isExternal?: boolean;
  };
  headingLevel?: 2 | 3;
  className?: string;
};

const iconSizes: Record<ButtonSize, number> = {
  sm: 14,
  md: 18,
  lg: 20,
};

export const Callout: FC<CalloutProps> = ({
  title,
  description,
  button,
  headingLevel = 2,
  className,
}) => {
  const size = button.size ?? 'md';

  return (
    <div
      className={cn(
        'rounded-3xl bg-slate-50 ring-1 ring-slate-100 p-8 text-center dark:bg-slate-900 dark:ring-slate-800',
        className,
      )}
    >
      <Heading level={headingLevel} size="lg" className="mb-2">
        {title}
      </Heading>
      <Content className="mb-6">{description}</Content>
      <NextLink
        href={button.href}
        target={button.isExternal ? '_blank' : undefined}
        rel={button.isExternal ? 'noopener noreferrer' : undefined}
      >
        <Button variant={button.variant ?? 'secondary'} size={size}>
          {button.icon && (
            <HugeiconsIcon icon={button.icon} size={iconSizes[size]} />
          )}
          {button.label}
        </Button>
      </NextLink>
    </div>
  );
};
