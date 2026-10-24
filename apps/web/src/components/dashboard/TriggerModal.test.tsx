import { fireEvent, render, screen, within } from '@testing-library/react';

import { recipes } from '@/config/recipes';
import { githubAppUrl } from '@/utils/githubAppUrl';

import { TriggerModal } from './TriggerModal';

let mockRepositories: { fullName: string; name: string; uuid: string }[] = [];

jest.mock('@/hooks/useRepositories', () => ({
  useRepositories: () => mockRepositories,
}));

jest.mock('@/store/useTriggersStore', () => ({
  useTriggersStore: (selector: (state: unknown) => unknown) =>
    selector({ createTrigger: jest.fn(), updateTrigger: jest.fn() }),
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

const renderModal = (props: Partial<Parameters<typeof TriggerModal>[0]> = {}) =>
  render(<TriggerModal open setOpenAction={jest.fn()} {...props} />);

describe('TriggerModal', () => {
  beforeEach(() => {
    mockRepositories = [];
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
});
