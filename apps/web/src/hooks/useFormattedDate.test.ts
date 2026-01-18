import { renderHook, waitFor } from '@testing-library/react';

import { useFormattedDate } from './useFormattedDate';

describe('useFormattedDate', () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).navigator = originalNavigator;
  });

  it('should format date correctly using default options (en-US)', async () => {
    Object.defineProperty(global, 'navigator', {
      value: { language: 'en-US' },
      writable: true,
    });

    const date = new Date('2026-01-13T12:00:00Z');
    const { result } = renderHook(() => useFormattedDate(date));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.formattedDate).not.toBe('');
    expect(result.current.formattedDate).toContain('Jan 13');
  });

  it('should format date correctly using a different locale (de-DE)', async () => {
    Object.defineProperty(global, 'navigator', {
      value: { language: 'de-DE' },
      writable: true,
    });

    const date = new Date('2026-01-13T12:00:00Z');
    const { result } = renderHook(() => useFormattedDate(date));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.formattedDate).toContain('13');
    expect(result.current.formattedDate).toContain('Jan');
  });

  it('should accept custom Intl options', async () => {
    Object.defineProperty(global, 'navigator', {
      value: { language: 'en-US' },
      writable: true,
    });

    const date = new Date('2026-01-13T12:00:00Z');
    const customOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
    };

    const { result } = renderHook(() => useFormattedDate(date, customOptions));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.formattedDate).toContain('Tuesday');
    expect(result.current.formattedDate).toContain('2026');
  });

  it('should fallback to en-US if locale throws an error', async () => {
    Object.defineProperty(global, 'navigator', {
      value: { language: 'invalid-LOCALE-123' },
      writable: true,
    });

    const date = new Date('2026-01-13T12:00:00Z');
    const { result } = renderHook(() => useFormattedDate(date));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.formattedDate).toContain('Jan 13');
  });
});
