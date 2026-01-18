import { ReactElement } from 'react';

import { renderHook } from '@testing-library/react';

import { SelectGroup } from '@/components/ui/SelectGroup';
import { SelectGroupLabel } from '@/components/ui/SelectGroupLabel';
import { SelectItem } from '@/components/ui/SelectItem';
import { getGroupedGithubEvents } from '@/utils/githubEvents';

import { useGithubEventsOptions } from './useGithubEventsOptions';

jest.mock('@/utils/githubEvents', () => ({
  getGroupedGithubEvents: jest.fn(),
}));

type MockItemProps = {
  value: string;
  children: string;
};

describe('useGithubEventsOptions', () => {
  it('should transform grouped events into Select components correctly', () => {
    const mockData = [
      {
        name: 'test_group',
        label: 'Test Group',
        items: [
          { value: 'event.a', label: 'Event A' },
          { value: 'event.b', label: 'Event B' },
        ],
      },
    ];

    (getGroupedGithubEvents as jest.Mock).mockReturnValue(mockData);

    // Render the hook
    const { result } = renderHook(() => useGithubEventsOptions());

    const groups = result.current as ReactElement[];

    // Should generate 1 group
    expect(groups).toHaveLength(1);

    const groupElement = groups[0] as ReactElement<{
      children: [ReactElement, ReactElement[]];
    }>;

    // Check Group Props/Key
    expect(groupElement.key).toBe('test_group');
    expect(groupElement.type).toBe(SelectGroup);

    // Check Group Children
    const groupChildren = groupElement.props.children;
    expect(groupChildren).toHaveLength(2);

    // Verify Label
    // Cast strict type for the label element
    const labelElement = groupChildren[0] as ReactElement<{ children: string }>;
    expect(labelElement.type).toBe(SelectGroupLabel);
    expect(labelElement.props.children).toBe('Test Group');

    // Verify Items
    const itemsElements = groupChildren[1] as ReactElement[];
    expect(itemsElements).toHaveLength(2);

    // Item 1 - Cast to our helper type
    const item1 = itemsElements[0] as ReactElement<MockItemProps>;
    expect(item1.key).toBe('event.a');
    expect(item1.type).toBe(SelectItem);
    expect(item1.props.value).toBe('event.a');
    expect(item1.props.children).toBe('Event A');

    // Item 2 - Cast to our helper type
    const item2 = itemsElements[1] as ReactElement<MockItemProps>;
    expect(item2.key).toBe('event.b');
    expect(item2.type).toBe(SelectItem);
    expect(item2.props.value).toBe('event.b');
    expect(item2.props.children).toBe('Event B');
  });

  it('should return an empty array if no events exist', () => {
    (getGroupedGithubEvents as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => useGithubEventsOptions());

    expect(result.current).toEqual([]);
  });
});
