import { FC, ReactNode } from 'react';

import clsx from 'clsx';

import { Card } from '@/components/ui/Card';
import { CardBody } from '@/components/ui/CardBody';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';

export type RoadmapPhaseProps = {
  icon: ReactNode;
  phase: string;
  status: string;
  colorClass: string;
  dotClass: string;
  children: ReactNode;
  isActive?: boolean;
};

export const RoadmapPhase: FC<RoadmapPhaseProps> = ({
  icon,
  phase,
  status,
  colorClass,
  dotClass,
  children,
  isActive = false,
}) => {
  return (
    <div className="relative flex gap-8 md:gap-12">
      <div className="hidden md:flex flex-col items-center shrink-0 w-16 pt-2">
        <div
          className={clsx(
            'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white shadow-md',
            dotClass,
          )}
        >
          {isActive && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-inherit" />
          )}
        </div>
      </div>

      <div className="flex-1">
        <Card
          variant="elevated"
          className="group hover:shadow-xl hover:shadow-slate-200/50"
        >
          <CardBody className="p-6 sm:p-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={clsx(
                    'flex h-12 w-12 items-center justify-center rounded-xl shadow-sm',
                    colorClass,
                  )}
                >
                  {icon}
                </div>
                <div>
                  <Heading level={3} size="lg">
                    {phase}
                  </Heading>
                  <Content size="xs" className="font-semibold uppercase">
                    {status}
                  </Content>
                </div>
              </div>
            </div>

            <div className="space-y-8 relative">
              <div className="absolute left-1.75 top-2 bottom-2 w-px bg-slate-100"></div>
              {children}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
