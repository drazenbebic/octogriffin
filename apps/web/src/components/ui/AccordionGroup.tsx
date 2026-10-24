'use client';

import type { ReactElement, ReactNode } from 'react';
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useMemo,
  useState,
} from 'react';

import type { AccordionProps } from '@/components/ui/Accordion';
import { cn } from '@/utils/cn';

type AccordionGroupProps = {
  allowMultiple?: boolean;
  children: ReactNode;
  className?: string;
  openIndex?: number;
};

function isAccordionElement(
  child: ReactNode,
): child is ReactElement<AccordionProps> {
  return isValidElement(child);
}

export const AccordionGroup = ({
  allowMultiple = false,
  children,
  className,
  openIndex: defaultOpenIndex,
}: AccordionGroupProps) => {
  const [openIndices, setOpenIndices] = useState<number[]>(
    defaultOpenIndex !== undefined ? [defaultOpenIndex] : [],
  );

  const accordions = useMemo(
    () => Children.toArray(children).filter(isAccordionElement),
    [children],
  );

  const onClick = useCallback(
    (open: boolean, index: number) => {
      setOpenIndices(prev => {
        if (allowMultiple) {
          return open ? [...prev, index] : prev.filter(i => i !== index);
        } else {
          return open ? [index] : [];
        }
      });
    },
    [allowMultiple],
  );

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-border bg-surface shadow-e1',
        className,
      )}
    >
      {accordions.map((accordion, i) => {
        const isOpen = allowMultiple
          ? openIndices.includes(i)
          : openIndices[0] === i;

        return cloneElement(accordion, {
          index: i,
          onClick,
          open: isOpen,
        });
      })}
    </div>
  );
};
