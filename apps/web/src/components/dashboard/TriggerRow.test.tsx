import { render, screen } from '@testing-library/react';

import type { TriggerWithRepos } from '@/types/triggers';

import { TriggerRow } from './TriggerRow';

jest.mock('@/actions/triggers/createTriggerAction', () => ({
  createTriggerAction: jest.fn(),
}));
jest.mock('@/actions/triggers/deleteTriggerAction', () => ({
  deleteTriggerAction: jest.fn(),
}));
jest.mock('@/actions/triggers/getTriggersAction', () => ({
  getTriggersAction: jest.fn(),
}));
jest.mock('@/actions/triggers/toggleTriggerAction', () => ({
  toggleTriggerAction: jest.fn(),
}));
jest.mock('@/actions/triggers/updateTriggerAction', () => ({
  updateTriggerAction: jest.fn(),
}));
jest.mock('sonner', () => ({ toast: { error: jest.fn() } }));

const savedTrigger = (
  cooldownSeconds: null | number,
  dailyCap: null | number = null,
) =>
  ({
    cooldownSeconds,
    dailyCap,
    event: 'push',
    isActive: true,
    repositories: [{ name: 'octogriffin', uuid: 'uuid-octogriffin' }],
    scoreDirection: 'up',
    taskAttribute: 'str',
    taskFrequency: 'daily',
    taskPriority: 1,
    taskTitle: 'Write code',
    uuid: 'trigger-uuid',
  }) as unknown as TriggerWithRepos;

describe('TriggerRow', () => {
  it('shows the cooldown of a trigger', () => {
    render(<TriggerRow totalRepos={1} trigger={savedTrigger(600)} />);

    expect(screen.getByText('10 min cooldown')).toBeTruthy();
  });

  it('shows no cooldown chip without a cooldown', () => {
    render(<TriggerRow totalRepos={1} trigger={savedTrigger(null)} />);

    expect(screen.queryByText(/cooldown/i)).toBeNull();
  });

  it('shows the daily cap of a trigger', () => {
    render(<TriggerRow totalRepos={1} trigger={savedTrigger(null, 10)} />);

    screen.getByText('10/day');
  });

  it('shows no daily cap chip without a cap', () => {
    render(<TriggerRow totalRepos={1} trigger={savedTrigger(null)} />);

    expect(screen.queryByText(/\/day/)).toBeNull();
  });
});
