'use client';

import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { AccordionProps } from '@/components/ui/Accordion';
import { cn } from '@/utils/cn';

type AccordionGroupProps = {
  className?: string;
  children: ReactNode;
  openIndex?: number;
  allowMultiple?: boolean;
};

function isAccordionElement(
  child: ReactNode,
): child is ReactElement<AccordionProps> {
  return isValidElement(child);
}

export const AccordionGroup = ({
  children,
  className,
  openIndex: defaultOpenIndex,
  allowMultiple = false,
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
    <div className={cn('flex flex-col gap-4', className)}>
      {accordions.map((accordion, i) => {
        const isOpen = allowMultiple
          ? openIndices.includes(i)
          : openIndices[0] === i;

        return cloneElement(accordion, {
          onClick,
          index: i,
          open: isOpen,
        });
      })}
    </div>
  );
};
