import { useMemo } from 'react';

import { SelectGroup } from '@/components/ui/SelectGroup';
import { SelectGroupLabel } from '@/components/ui/SelectGroupLabel';
import { SelectItem } from '@/components/ui/SelectItem';
import { getGroupedGithubEvents } from '@/utils/githubEvents';

export const useGithubEventsOptions = () => {
  return useMemo(() => {
    const groups = getGroupedGithubEvents();

    return groups.map(group => (
      <SelectGroup key={group.name}>
        <SelectGroupLabel>{group.label}</SelectGroupLabel>
        {group.items.map(item => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectGroup>
    ));
  }, []);
};
