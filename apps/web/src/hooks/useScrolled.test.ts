import { act, renderHook } from '@testing-library/react';

import { useScrolled } from './useScrolled';

const scrollTo = (y: number) => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: y });
  window.dispatchEvent(new Event('scroll'));
};

describe('useScrolled', () => {
  afterEach(() => scrollTo(0));

  it('is false at the top of the page', () => {
    scrollTo(0);

    const { result } = renderHook(() => useScrolled());

    expect(result.current).toBe(false);
  });

  it('turns true once the page scrolls past the threshold', () => {
    const { result } = renderHook(() => useScrolled());

    act(() => scrollTo(9));

    expect(result.current).toBe(true);

    act(() => scrollTo(8));

    expect(result.current).toBe(false);
  });
});
