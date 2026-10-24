import { createTriggerAction } from '@/actions/triggers/createTriggerAction';
import { getTriggersAction } from '@/actions/triggers/getTriggersAction';

import { useTriggersStore } from './useTriggersStore';

jest.mock('@/actions/triggers/createTriggerAction', () => ({
  createTriggerAction: jest.fn(),
}));
jest.mock('@/actions/triggers/getTriggersAction', () => ({
  getTriggersAction: jest.fn(),
}));
jest.mock('@/actions/triggers/deleteTriggerAction', () => ({
  deleteTriggerAction: jest.fn(),
}));
jest.mock('@/actions/triggers/toggleTriggerAction', () => ({
  toggleTriggerAction: jest.fn(),
}));
jest.mock('@/actions/triggers/updateTriggerAction', () => ({
  updateTriggerAction: jest.fn(),
}));
jest.mock('sonner', () => ({ toast: { error: jest.fn() } }));

describe('useTriggersStore', () => {
  it('remembers triggers created in this visit so the list can mark them as new', async () => {
    (createTriggerAction as jest.Mock).mockResolvedValue({
      data: { uuid: 'new-trigger' },
      success: true,
    });
    (getTriggersAction as jest.Mock).mockResolvedValue({
      data: { data: [], meta: { limit: 10, page: 1, total: 1, totalPages: 1 } },
      success: true,
    });

    await useTriggersStore
      .getState()
      .createTrigger({} as Parameters<typeof createTriggerAction>[0]);

    expect(useTriggersStore.getState().recentlyCreated).toEqual([
      'new-trigger',
    ]);
  });
});
