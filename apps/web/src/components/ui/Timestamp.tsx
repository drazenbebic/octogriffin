'use client';

import { ElementType, FC } from 'react';

import { useFormattedDate } from '@/hooks/useFormattedDate';

export type TimestampProps = {
  as?: ElementType;
  className?: string;
  date: Date;
  options?: Intl.DateTimeFormatOptions;
};

export const Timestamp: FC<TimestampProps> = ({
  as: Tag = 'time',
  className,
  date,
  options,
}) => {
  const { formattedDate } = useFormattedDate(date, options);

  return (
    <Tag className={className} dateTime={date.toISOString()}>
      {formattedDate}
    </Tag>
  );
};
