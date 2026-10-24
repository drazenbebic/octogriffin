import { act, renderHook } from '@testing-library/react';

import { getRepositoriesAction } from '@/actions/repositories/getRepositoriesAction';

import { useRepositories, useRepositoriesState } from './useRepositories';

jest.mock('@/actions/repositories/getRepositoriesAction', () => ({
  getRepositoriesAction: jest.fn(),
}));

describe('useRepositories', () => {
  it('fetches once for every component on the page and reports when it has loaded', async () => {
    (getRepositoriesAction as jest.Mock).mockResolvedValue({
      data: [{ name: 'octogriffin', uuid: 'a' }],
      success: true,
    });

    const first = renderHook(() => useRepositoriesState());

    renderHook(() => useRepositories());
    renderHook(() => useRepositories());

    expect(first.result.current.hasLoaded).toBe(false);

    await act(async () => {
      await Promise.resolve();
    });

    expect(getRepositoriesAction).toHaveBeenCalledTimes(1);
    expect(first.result.current).toEqual({
      hasLoaded: true,
      repositories: [{ name: 'octogriffin', uuid: 'a' }],
    });
  });
});
