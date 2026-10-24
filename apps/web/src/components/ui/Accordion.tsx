'use client';

import type { FC, ReactNode } from 'react';
import { useCallback, useState } from 'react';

import {
  Disclosure,
  DisclosureContent,
  DisclosureProvider,
} from '@ariakit/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Heading } from '@/components/ui/Heading';
import { cn } from '@/utils/cn';

export type AccordionProps = {
  children: ReactNode;
  className?: string;
  index?: number;
  onClick?: (open: boolean, index: number) => void;
  open?: boolean;
  title: string;
};

export const Accordion: FC<AccordionProps> = ({
  children,
  className,
  index = -1,
  onClick,
  open: isOpen = false,
  title,
}) => {
  const [open, setOpen] = useState(isOpen);
  const [previousIsOpen, setPreviousIsOpen] = useState(isOpen);

  // Follow the `open` prop whenever the parent changes it
  if (isOpen !== previousIsOpen) {
    setPreviousIsOpen(isOpen);
    setOpen(isOpen);
  }

  const onClickCallback = useCallback(() => {
    if (onClick) {
      onClick(!open, index);
    }
  }, [onClick, open, index]);

  return (
    <div
      className={cn(
        'group border-b border-line transition-colors duration-[var(--dur-fast)] last:border-b-0',
        open && 'bg-sunken',
        className,
      )}
    >
      <DisclosureProvider open={open} setOpen={setOpen}>
        <Disclosure
          className="w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset cursor-pointer "
          onClick={onClickCallback}
          render={
            <Heading
              as="button"
              className="flex items-center justify-between px-5 py-4 text-left text-[15px]"
              color="inherit"
              level={4}
              size="base"
            >
              <span className={cn('font-semibold text-text')}>{title}</span>
              <div
                className={cn(
                  'ml-4 flex shrink-0 items-center justify-center transition-transform duration-[var(--dur-base)]',
                  open ? 'rotate-180 text-accent-text' : 'text-muted',
                )}
              >
                <HugeiconsIcon icon={ArrowDown01Icon} size={18} />
              </div>
            </Heading>
          }
        />

        <DisclosureContent
          className={cn(
            'grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-in-out',
            'data-enter:grid-rows-[1fr]',
          )}
        >
          <div className="overflow-hidden">
            <div className="max-w-measure px-5 pb-5 text-[15px] leading-relaxed text-text-2">
              {children}
            </div>
          </div>
        </DisclosureContent>
      </DisclosureProvider>
    </div>
  );
};
