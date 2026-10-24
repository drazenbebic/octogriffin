import type { FC, ReactNode } from 'react';

import { Heading } from '@/components/ui/Heading';
import { cn } from '@/utils/cn';

export type DocsStepProps = {
  children: ReactNode;
  className?: string;
  heading?: string;
  step?: number;
  withoutBorder?: boolean;
};

export const DocsStep: FC<DocsStepProps> = ({
  children,
  className,
  heading,
  step,
  withoutBorder = false,
}) => {
  return (
    <section className={cn('space-y-6', className)}>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fill text-text-2 font-bold text-sm ">
          {step}
        </div>
        <Heading level={3} size="lg">
          {heading}
        </Heading>
      </div>

      {withoutBorder ? (
        children
      ) : (
        <div className="border-l-2 border-line pl-4 ml-4 space-y-4 ">
          {children}
        </div>
      )}
    </section>
  );
};
