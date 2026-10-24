import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';

import { recipes } from '@/config/recipes';
import type { TriggerWithRepos } from '@/types/triggers';
import { githubAppUrl } from '@/utils/githubAppUrl';

import { TriggerModal } from './TriggerModal';

let mockRepositories: { fullName: string; name: string; uuid: string }[] = [];
let mockHasLoaded = true;

jest.mock('@/hooks/useRepositories', () => ({
  useRepositories: () => mockRepositories,
  useRepositoriesState: () => ({
    hasLoaded: mockHasLoaded,
    repositories: mockRepositories,
  }),
}));

const mockUpdateTrigger = jest.fn();

jest.mock('@/store/useTriggersStore', () => ({
  useTriggersStore: (selector: (state: unknown) => unknown) =>
    selector({ createTrigger: jest.fn(), updateTrigger: mockUpdateTrigger }),
}));

jest.mock('sonner', () => ({ toast: { success: jest.fn() } }));

const repo = (name: string) => ({
  fullName: `drazenbebic/${name}`,
  name,
  uuid: `uuid-${name}`,
});

// FormSubmit stays focusable when disabled, so it uses aria-disabled
const isDisabled = (button: HTMLElement) =>
  button.getAttribute('aria-disabled') === 'true' ||
  (button as HTMLButtonElement).disabled;

const savedTrigger = (
  cooldownSeconds: null | number,
  dailyCap: null | number = null,
) =>
  ({
    cooldownSeconds,
    dailyCap,
    event: 'push',
    isActive: true,
    repositories: [{ uuid: 'uuid-octogriffin' }],
    scoreDirection: 'up',
    taskAlias: null,
    taskAttribute: 'str',
    taskFrequency: 'daily',
    taskNote: null,
    taskPriority: 1,
    taskTags: null,
    taskTitle: 'Write code',
    uuid: 'trigger-uuid',
  }) as unknown as TriggerWithRepos;

const renderModal = (props: Partial<Parameters<typeof TriggerModal>[0]> = {}) =>
  render(<TriggerModal open setOpenAction={jest.fn()} {...props} />);

describe('TriggerModal', () => {
  beforeEach(() => {
    mockRepositories = [];
    mockHasLoaded = true;
    process.env.NEXT_PUBLIC_GITHUB_APP_URL =
      'https://github.com/apps/octogriffin';
  });

  it('explains what to do when no repository is connected yet', () => {
    renderModal({ recipe: recipes[1] });

    screen.getByRole('heading', { name: 'Add “Ship pull requests”' });
    expect(
      screen
        .getByRole('link', {
          name: 'Install the GitHub App on a repository first',
        })
        .getAttribute('href'),
    ).toBe(githubAppUrl());
    expect(
      isDisabled(screen.getByRole('button', { name: 'Add trigger' })),
    ).toBe(true);
  });

  it('pre-selects the only repository so a recipe is one click', () => {
    mockRepositories = [repo('octogriffin')];

    renderModal({ recipe: recipes[1] });

    const sentence = screen.getByTestId('trigger-sentence');

    expect(sentence.textContent).toContain('octogriffin');
    expect(
      isDisabled(screen.getByRole('button', { name: 'Add trigger' })),
    ).toBe(false);
  });

  it('keeps the sentence in step with the form', () => {
    mockRepositories = [repo('octogriffin'), repo('bebic.dev')];

    renderModal();

    const difficulty = screen.getByRole('radiogroup', { name: 'Difficulty' });

    fireEvent.click(within(difficulty).getByRole('radio', { name: /Medium/ }));

    expect(screen.getByTestId('trigger-sentence').textContent).toContain(
      'Medium',
    );
  });

  it('does not ask you to install the app while repositories are still loading', () => {
    mockHasLoaded = false;

    renderModal({ recipe: recipes[1] });

    expect(
      screen.queryByRole('link', {
        name: 'Install the GitHub App on a repository first',
      }),
    ).toBeNull();
  });

  it('moves focus to the repository picker once several repositories arrive', async () => {
    mockHasLoaded = false;

    const { rerender } = renderModal({ recipe: recipes[1] });

    // Repositories arrive over the network, after the dialog has settled
    await waitFor(() =>
      expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(
        true,
      ),
    );

    mockHasLoaded = true;
    mockRepositories = [repo('octogriffin'), repo('bebic.dev'), repo('vadb')];
    rerender(
      <TriggerModal open recipe={recipes[1]} setOpenAction={jest.fn()} />,
    );

    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole('combobox', { name: /Repositories/ }),
      ),
    );
  });

  describe('cooldown', () => {
    // Ariakit links the label to its field after mount, which jsdom misses
    const cooldownInput = () =>
      screen.getByPlaceholderText('None') as HTMLInputElement;

    beforeEach(() => {
      mockRepositories = [repo('octogriffin')];
      mockUpdateTrigger.mockReset();
    });

    it('picks minutes for a trigger added from a recipe', () => {
      renderModal({ recipe: recipes[1] });

      fireEvent.click(
        screen.getByRole('button', {
          name: 'Change title, difficulty or attribute',
        }),
      );

      expect(
        within(screen.getByRole('radiogroup', { name: 'Unit' }))
          .getByRole('radio', { name: 'minutes' })
          .getAttribute('aria-checked'),
      ).toBe('true');
    });

    it('shows the cooldown of a trigger you edit', () => {
      renderModal({ trigger: savedTrigger(7200) });

      expect(cooldownInput().value).toBe('2');
      expect(
        within(screen.getByRole('radiogroup', { name: 'Unit' }))
          .getByRole('radio', { name: 'hours' })
          .getAttribute('aria-checked'),
      ).toBe('true');
    });

    it('explains a cooldown that is too long', async () => {
      renderModal({ trigger: savedTrigger(null) });

      fireEvent.change(cooldownInput(), {
        target: { value: '400' },
      });
      fireEvent.click(
        within(screen.getByRole('radiogroup', { name: 'Unit' })).getByRole(
          'radio',
          { name: 'days' },
        ),
      );
      fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

      await screen.findByText('Please keep the cooldown to 365 days or less.');
      expect(mockUpdateTrigger).not.toHaveBeenCalled();
    });

    it('saves a trigger with a cooldown', async () => {
      renderModal({ trigger: savedTrigger(null) });

      fireEvent.change(cooldownInput(), {
        target: { value: '10' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

      await waitFor(() =>
        expect(mockUpdateTrigger).toHaveBeenCalledWith(
          'trigger-uuid',
          expect.objectContaining({
            cooldownAmount: 10,
            cooldownUnit: 'minutes',
          }),
        ),
      );
    });
  });

  describe('daily cap', () => {
    const dailyCapInput = () =>
      screen.getByPlaceholderText('No cap') as HTMLInputElement;

    beforeEach(() => {
      mockRepositories = [repo('octogriffin')];
      mockUpdateTrigger.mockReset();
    });

    it('shows the daily cap of a trigger you edit', () => {
      renderModal({ trigger: savedTrigger(null, 10) });

      expect(dailyCapInput().value).toBe('10');
    });

    it('explains a daily cap that is too high', async () => {
      renderModal({ trigger: savedTrigger(null) });

      fireEvent.change(dailyCapInput(), { target: { value: '1001' } });
      fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

      await screen.findByText('Please keep the daily cap to 1,000 or less.');
      expect(mockUpdateTrigger).not.toHaveBeenCalled();
    });

    it('saves a trigger with a daily cap', async () => {
      renderModal({ trigger: savedTrigger(null) });

      fireEvent.change(dailyCapInput(), { target: { value: '5' } });
      fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

      await waitFor(() =>
        expect(mockUpdateTrigger).toHaveBeenCalledWith(
          'trigger-uuid',
          expect.objectContaining({ dailyCap: 5 }),
        ),
      );
    });
  });
});
