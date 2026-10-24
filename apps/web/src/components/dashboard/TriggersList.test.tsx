import { renderToString } from 'react-dom/server';

import { act, render, screen } from '@testing-library/react';

import { getTriggersAction } from '@/actions/triggers/getTriggersAction';
import { useTriggersStore } from '@/store/useTriggersStore';

import { TriggersList } from './TriggersList';

jest.mock('@/actions/triggers/getTriggersAction', () => ({
  getTriggersAction: jest.fn(),
}));
jest.mock('@/actions/triggers/createTriggerAction', () => ({
  createTriggerAction: jest.fn(),
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
jest.mock('@/hooks/useRepositories', () => ({ useRepositories: () => [] }));
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  useSession: () => ({ status: 'authenticated' }),
}));
jest.mock('sonner', () => ({ toast: { error: jest.fn() } }));

const wait = (ms: number) =>
  act(() => new Promise(resolve => setTimeout(resolve, ms)));

describe('TriggersList', () => {
  beforeEach(() => {
    useTriggersStore.setState(useTriggersStore.getInitialState(), true);
    (getTriggersAction as jest.Mock).mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                data: {
                  data: [],
                  meta: { limit: 5, page: 1, total: 0, totalPages: 0 },
                },
                success: true,
              }),
            5,
          ),
        ),
    );
  });

  it('loads an empty list once instead of re-fetching for every recipe card', async () => {
    render(<TriggersList />);
    await wait(300);

    expect(getTriggersAction).toHaveBeenCalledTimes(1);
    screen.getByText('No triggers yet');
  });

  it('does not claim the list is empty in the first, server-rendered paint', () => {
    expect(renderToString(<TriggersList />)).not.toContain('No triggers yet');
  });
});
