import { renderHook } from '@testing-library/react';

import type { GithubSelectedRepositoriesModel } from '@/generated/prisma/models/GithubSelectedRepositories';

import { useRepositoryOptions } from './useRepositoryOptions';

describe('useRepositoryOptions', () => {
  it('should return an empty array when input is empty', () => {
    const { result } = renderHook(() => useRepositoryOptions([]));
    expect(result.current).toEqual([]);
  });

  it('should correctly map repositories to options', () => {
    const mockRepositories = [
      { fullName: 'user/repo-one', uuid: 'uuid-1' },
      { fullName: 'user/repo-two', uuid: 'uuid-2' },
    ] as GithubSelectedRepositoriesModel[];

    const { result } = renderHook(() => useRepositoryOptions(mockRepositories));

    expect(result.current).toEqual([
      { label: 'user/repo-one', value: 'uuid-1' },
      { label: 'user/repo-two', value: 'uuid-2' },
    ]);
  });

  it('should memoize the result', () => {
    const mockRepositories = [
      { fullName: 'user/repo-one', uuid: 'uuid-1' },
    ] as GithubSelectedRepositoriesModel[];

    const { rerender, result } = renderHook(
      props => useRepositoryOptions(props),
      { initialProps: mockRepositories },
    );

    const firstResult = result.current;

    rerender(mockRepositories);

    expect(result.current).toBe(firstResult);
  });
});
