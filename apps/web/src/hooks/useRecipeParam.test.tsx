import { renderHook } from '@testing-library/react';

import { recipes } from '@/config/recipes';

import { useRecipeParam } from './useRecipeParam';

const mockReplace = jest.fn();
let mockSearch = '';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => new URLSearchParams(mockSearch),
}));

describe('useRecipeParam', () => {
  beforeEach(() => mockReplace.mockClear());

  it('returns the recipe named in the URL', () => {
    mockSearch = 'recipe=ship-pull-requests';

    const { result } = renderHook(() => useRecipeParam());

    expect(result.current.recipe).toBe(recipes[1]);
    expect(mockReplace).not.toHaveBeenCalled();

    result.current.clear();

    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });

  it('ignores a tampered slug and removes it from the URL', () => {
    mockSearch = 'recipe=../../etc';

    const { result } = renderHook(() => useRecipeParam());

    expect(result.current.recipe).toBeUndefined();
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });

  it('does nothing without a recipe in the URL', () => {
    mockSearch = '';

    const { result } = renderHook(() => useRecipeParam());

    expect(result.current.recipe).toBeUndefined();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
