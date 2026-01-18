import { renderHook } from '@testing-library/react';
import {
  AlertCircleIcon,
  GitBranchIcon,
  GitCommitIcon,
  GitPullRequestIcon,
  ZapIcon,
} from 'hugeicons-react';

import { useEventIcon } from './useEventIcon';

describe('useEventIcon', () => {
  it('should return GitCommitIcon for "push" event (Exact Match)', () => {
    const { result } = renderHook(() => useEventIcon('push'));

    // Check if the returned JSX element is of the correct component type
    expect(result.current.type).toBe(GitCommitIcon);
  });

  it('should return GitPullRequestIcon for "pull_request.opened" (Prefix Match)', () => {
    // "pull_request" is in the map, so "pull_request.opened" should match via startsWith
    const { result } = renderHook(() => useEventIcon('pull_request.opened'));

    expect(result.current.type).toBe(GitPullRequestIcon);
  });

  it('should return AlertCircleIcon for "issue.comment" (Prefix Match)', () => {
    const { result } = renderHook(() => useEventIcon('issue.comment'));

    expect(result.current.type).toBe(AlertCircleIcon);
  });

  it('should return GitBranchIcon for "create" and "delete" (Exact Match Group)', () => {
    const { result: createResult } = renderHook(() => useEventIcon('create'));
    const { result: deleteResult } = renderHook(() => useEventIcon('delete'));

    expect(createResult.current.type).toBe(GitBranchIcon);
    expect(deleteResult.current.type).toBe(GitBranchIcon);
  });

  it('should return ZapIcon for unknown events (Fallback)', () => {
    const { result } = renderHook(() => useEventIcon('unknown.event.type'));

    expect(result.current.type).toBe(ZapIcon);
  });

  it('should pass props correctly to the icon', () => {
    const props = { size: 32, className: 'text-red-500' };
    const { result } = renderHook(() => useEventIcon('push', props));

    // Verify the props on the returned React Element
    expect(result.current.props).toEqual(expect.objectContaining(props));
    expect(result.current.props.size).toBe(32);
    expect(result.current.props.className).toBe('text-red-500');
  });
});
