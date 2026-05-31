'use client';

import { FC, ReactNode, useCallback, useEffect, useState } from 'react';

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
  title: string;
  children: ReactNode;
  className?: string;
  index?: number;
  onClick?: (open: boolean, index: number) => void;
  open?: boolean;
};

export const Accordion: FC<AccordionProps> = ({
  title,
  children,
  className,
  index = -1,
  onClick,
  open: isOpen = false,
}) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const onClickCallback = useCallback(() => {
    if (onClick) {
      onClick(!open, index);
    }
  }, [onClick, open, index]);

  return (
    <div
      className={cn(
        'group overflow-hidden rounded-2xl border transition-all duration-300 ease-in-out',
        open
          ? 'border-violet-200 bg-white shadow-lg shadow-violet-900/5 dark:border-violet-900/50 dark:bg-slate-900'
          : 'border-slate-200 bg-slate-50 hover:border-violet-200 hover:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-violet-900/50 dark:hover:bg-slate-900',
        className,
      )}
    >
      <DisclosureProvider open={open} setOpen={setOpen}>
        <Disclosure
          onClick={onClickCallback}
          className="w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-inset cursor-pointer dark:focus-visible:ring-violet-500"
          render={
            <Heading
              as="button"
              level={4}
              size="base"
              className="flex items-center justify-between px-6 py-4 text-left"
              color="inherit"
            >
              <span
                className={cn(
                  'font-medium transition-colors duration-200',
                  open
                    ? 'text-violet-900 dark:text-violet-300'
                    : 'text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-100',
                )}
              >
                {title}
              </span>
              <div
                className={cn(
                  'ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                  open
                    ? 'bg-violet-100 text-violet-600 rotate-180 dark:bg-violet-900/50 dark:text-violet-300'
                    : 'bg-white text-slate-400 group-hover:bg-violet-50 group-hover:text-violet-500 dark:bg-slate-800 dark:text-slate-500 dark:group-hover:bg-slate-700 dark:group-hover:text-violet-400',
                )}
              >
                <HugeiconsIcon icon={ArrowDown01Icon} size={20} />
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
            <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed dark:text-slate-400">
              {children}
            </div>
          </div>
        </DisclosureContent>
      </DisclosureProvider>
    </div>
  );
};
