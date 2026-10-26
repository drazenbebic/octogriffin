import Image from 'next/image';
import type { FC, ReactNode } from 'react';

import { Heading } from '@/components/ui/Heading';
import { Shell } from '@/components/ui/Shell';

export type PageHeaderProps = {
  /** Shown beside the title on wide screens, e.g. "Last updated …". */
  aside?: ReactNode;
  /** Extra content under the description, e.g. a chip or a search field. */
  children?: ReactNode;
  description?: ReactNode;
  title: string;
};

/**
 * The full-width grain band that opens content pages: legal pages, FAQ,
 * docs overview, sponsors, installation and profile.
 */
export const PageHeader: FC<PageHeaderProps> = ({
  aside,
  children,
  description,
  title,
}) => (
  <div className="arcane">
    <Image
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute -top-24 right-[max(-6rem,calc(50%-44rem))] h-[420px] w-[420px] max-w-none opacity-[0.07]"
      height={420}
      src="/octogriffin_white.png"
      width={420}
    />
    <Shell className="flex flex-wrap items-end justify-between gap-6 pt-20 pb-14">
      <div className="flex max-w-[680px] flex-col gap-3">
        <Heading color="inherit" level={1} size="display">
          {title}
        </Heading>
        {!!description && (
          <p className="text-lg text-white/80">{description}</p>
        )}
        {children}
      </div>
      {!!aside && <div className="text-sm text-white/70">{aside}</div>}
    </Shell>
  </div>
);
