'use client';

import { useEffect, useState } from 'react';

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

export function useFormattedDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = DEFAULT_OPTIONS,
) {
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dateObj = new Date(date);

    const locale =
      typeof navigator !== 'undefined' ? navigator.language : 'en-US';

    try {
      const formatted = new Intl.DateTimeFormat(locale, options).format(
        dateObj,
      );
      setFormattedDate(formatted);
    } catch {
      setFormattedDate(
        new Intl.DateTimeFormat('en-US', options).format(dateObj),
      );
    } finally {
      setIsLoading(false);
    }
  }, [date, options]);

  return { formattedDate, isLoading };
}
