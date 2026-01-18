'use client';

import { FC } from 'react';

import { Button } from '@ariakit/react';
import clsx from 'clsx';
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Cancel01Icon,
  Delete02Icon,
  Edit02Icon,
} from 'hugeicons-react';

import { Badge, BadgeProps } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import { TriggersModel } from '@/generated/prisma/models/Triggers';
import { useEventIcon } from '@/hooks/useEventIcon';
import { useTriggersStore } from '@/store/useTriggersStore';

const getDifficultyConfig = (
  priority: number,
): {
  label: string;
  variant: BadgeProps['variant'];
} => {
  if (priority <= 0.1) return { label: 'Trivial', variant: 'neutral' };
  if (priority === 1) return { label: 'Easy', variant: 'success' };
  if (priority === 1.5) return { label: 'Medium', variant: 'warning' };
  if (priority >= 2) return { label: 'Hard', variant: 'error' };

  return { label: 'Unknown', variant: 'primary' };
};

export type TriggersListItemProps = {
  trigger: TriggersModel;
  onOpenDeleteAction?: (trigger: TriggersModel) => void;
  onOpenEditAction?: (trigger: TriggersModel) => void;
};

export const TriggersListItem: FC<TriggersListItemProps> = ({
  trigger,
  onOpenDeleteAction,
  onOpenEditAction,
}) => {
  const icon = useEventIcon(trigger.event, { size: 18 });
  const toggleTrigger = useTriggersStore(state => state.toggleTrigger);
  const difficulty = getDifficultyConfig(trigger.taskPriority);
  const isActive = trigger.isActive;

  const handleToggle = (checked: boolean) => {
    toggleTrigger({ uuid: trigger.uuid, isActive: checked });
  };

  return (
    <div
      key={trigger.uuid}
      className={clsx(
        'group flex flex-col gap-4 rounded-xl p-4 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between',
        !isActive ? 'bg-slate-50/80' : 'bg-white',
      )}
    >
      <div
        className={clsx('flex items-center gap-4', !isActive && 'opacity-75')}
      >
        <div
          className={clsx(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
            !isActive
              ? 'bg-slate-200 text-slate-500'
              : 'bg-violet-50 text-violet-600',
          )}
        >
          {!isActive ? <Cancel01Icon size={18} /> : icon}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4
              className={clsx(
                'font-semibold transition-colors',
                !isActive ? 'text-slate-500 line-through' : 'text-slate-900',
              )}
            >
              {trigger.taskTitle}
            </h4>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <Badge shape="square">on: {trigger.event}</Badge>
            <Badge shape="square" variant={difficulty.variant}>
              {difficulty.label}
            </Badge>
            <Badge
              shape="square"
              variant={trigger.scoreDirection === 'up' ? 'info' : 'error'}
            >
              {trigger.scoreDirection === 'up' ? (
                <>
                  <ArrowUp01Icon size={12} /> Reward
                </>
              ) : (
                <>
                  <ArrowDown01Icon size={12} /> Punish
                </>
              )}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <Switch
          checked={isActive}
          onChange={e => handleToggle(e.target.checked)}
          title={isActive ? 'Deactivate Trigger' : 'Activate Trigger'}
        />

        <div className="flex items-center gap-1 border-l border-slate-100 pl-4 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <Button
            onClick={() => onOpenEditAction?.(trigger)}
            className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            title="Edit Trigger"
          >
            <Edit02Icon size={18} />
          </Button>
          <Button
            onClick={() => onOpenDeleteAction?.(trigger)}
            className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
            title="Delete Trigger"
          >
            <Delete02Icon size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
