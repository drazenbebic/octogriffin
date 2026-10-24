'use client';

import type { FC } from 'react';

import {
  Delete02Icon,
  Edit02Icon,
  MoreVerticalIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { AttributeChip } from '@/components/ui/AttributeChip';
import { Chip } from '@/components/ui/Chip';
import { DifficultyLabel } from '@/components/ui/DifficultyLabel';
import { EventId } from '@/components/ui/EventId';
import { Menu, MenuItem } from '@/components/ui/Menu';
import { Switch } from '@/components/ui/Switch';
import { Tooltip } from '@/components/ui/Tooltip';
import { useEventIcon } from '@/hooks/useEventIcon';
import { useTriggersStore } from '@/store/useTriggersStore';
import type { TriggerWithRepos } from '@/types/triggers';
import { cn } from '@/utils/cn';
import { summariseRepositories } from '@/utils/describeTrigger';

export const triggerGridColumns =
  'grid grid-cols-[minmax(240px,2.4fr)_1.1fr_0.9fr_0.5fr_0.8fr_96px] gap-4';

export type TriggerRowProps = {
  isNew?: boolean;
  onDelete?: (trigger: TriggerWithRepos) => void;
  onEdit?: (trigger: TriggerWithRepos) => void;
  totalRepos: number;
  trigger: TriggerWithRepos;
};

export const TriggerRow: FC<TriggerRowProps> = ({
  isNew = false,
  onDelete,
  onEdit,
  totalRepos,
  trigger,
}) => {
  const icon = useEventIcon(trigger.event, { size: 18 });
  const toggleTrigger = useTriggersStore(state => state.toggleTrigger);
  const repoNames = trigger.repositories.map(repo => repo.name);
  const isPunish = trigger.scoreDirection === 'down';

  return (
    <div
      className={cn(
        triggerGridColumns,
        'items-center border-b border-line px-[18px] py-3.5 last:border-b-0',
        isNew && 'bg-accent-soft/40',
      )}
    >
      <div
        className={cn(
          'flex min-w-0 items-center gap-3',
          !trigger.isActive && 'opacity-55',
        )}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-text">
          {icon}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-text">
              {trigger.taskTitle}
            </span>
            {isNew && (
              <Chip className="text-[11px]" tone="accent">
                New
              </Chip>
            )}
          </span>
          <EventId
            className="truncate bg-transparent px-0 text-muted"
            event={trigger.event}
          />
        </div>
      </div>

      <div className={cn(!trigger.isActive && 'opacity-55')}>
        <Tooltip
          content={repoNames.join(', ') || 'No repositories'}
          title="Repositories"
        >
          <span
            className="cursor-help text-[13px] text-text-2 underline decoration-faint decoration-dotted underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-accent"
            tabIndex={0}
          >
            {summariseRepositories(repoNames, totalRepos)}
          </span>
        </Tooltip>
      </div>

      <DifficultyLabel
        className={cn(
          'text-[13px] text-text-2',
          !trigger.isActive && 'opacity-55',
        )}
        priority={trigger.taskPriority}
      />

      <div className={cn(!trigger.isActive && 'opacity-55')}>
        <AttributeChip attribute={trigger.taskAttribute} />
      </div>

      <div className={cn(!trigger.isActive && 'opacity-55')}>
        <Chip tone={isPunish ? 'hp' : 'ok'}>
          {isPunish ? 'Punish' : 'Reward'}
        </Chip>
      </div>

      <div className="flex items-center justify-end gap-1">
        <Switch
          aria-label={trigger.isActive ? 'Pause trigger' : 'Activate trigger'}
          checked={trigger.isActive}
          onChange={event =>
            toggleTrigger({
              isActive: event.target.checked,
              uuid: trigger.uuid,
            })
          }
        />
        <Menu
          label={`More actions for ${trigger.taskTitle}`}
          trigger={
            <button
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-[8px] text-muted transition-colors duration-[var(--dur-fast)] hover:bg-fill hover:text-text focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              type="button"
            >
              <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
            </button>
          }
        >
          <MenuItem icon={Edit02Icon} onClick={() => onEdit?.(trigger)}>
            Edit trigger
          </MenuItem>
          <MenuItem
            icon={Delete02Icon}
            onClick={() => onDelete?.(trigger)}
            tone="danger"
          >
            Delete trigger
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};
