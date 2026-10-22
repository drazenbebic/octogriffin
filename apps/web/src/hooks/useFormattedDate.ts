'use client';

import { useSyncExternalStore } from 'react';

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  month: 'short',
};

const subscribe = () => () => {};

/**
 * Formats a date in the visitor's locale. Renders an empty string on the
 * server and during hydration, so server and client markup always match.
 */
export function useFormattedDate(
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = DEFAULT_OPTIONS,
) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!isClient) {
    return { formattedDate: '', isLoading: true };
  }

  const dateObj = new Date(date);

  try {
    return {
      formattedDate: new Intl.DateTimeFormat(
        navigator.language,
        options,
      ).format(dateObj),
      isLoading: false,
    };
  } catch {
    return {
      formattedDate: new Intl.DateTimeFormat('en-US', options).format(dateObj),
      isLoading: false,
    };
  }
}
