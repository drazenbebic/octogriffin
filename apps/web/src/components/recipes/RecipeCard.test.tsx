import { fireEvent, render, screen } from '@testing-library/react';

import { recipes } from '@/config/recipes';

import { RecipeCard } from './RecipeCard';

const mockSession = { status: 'authenticated' };
const mockTriggers: { event: string; taskTitle: string }[] = [];
const mockSignIn = jest.fn();

jest.mock('next-auth/react', () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
  useSession: () => mockSession,
}));

jest.mock('@/store/useTriggersStore', () => {
  const state = () => ({
    fetchTriggers: jest.fn(),
    hasLoaded: true,
    isLoading: false,
    triggers: mockTriggers,
  });
  const useTriggersStore = (selector: (value: unknown) => unknown) =>
    selector(state());

  useTriggersStore.getState = state;

  return { useTriggersStore };
});

const recipe = recipes[1];

describe('RecipeCard', () => {
  beforeEach(() => {
    mockSession.status = 'authenticated';
    mockTriggers.length = 0;
  });

  it('links signed-in users to their dashboard with the recipe', () => {
    render(<RecipeCard recipe={recipe} />);

    expect(
      screen
        .getByRole('link', { name: 'Add to dashboard' })
        .getAttribute('href'),
    ).toBe('/dashboard?recipe=ship-pull-requests');
  });

  it('asks signed-out visitors to sign in and comes back to the recipe', () => {
    mockSession.status = 'unauthenticated';

    render(<RecipeCard recipe={recipe} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign in to add' }));

    expect(mockSignIn).toHaveBeenCalledWith('github', {
      callbackUrl: '/dashboard?recipe=ship-pull-requests',
    });
  });

  it('says so when the recipe is already in the dashboard', () => {
    mockTriggers.push({
      event: 'pull_request.opened',
      taskTitle: 'Opened a pull request',
    });

    render(<RecipeCard recipe={recipe} />);

    screen.getByText('In your dashboard');
    expect(screen.queryByRole('link', { name: 'Add to dashboard' })).toBeNull();
  });

  it('describes what the recipe does as a sentence', () => {
    render(<RecipeCard recipe={recipe} />);

    expect(screen.getByTestId('trigger-sentence').textContent).toContain(
      '“Opened a pull request”',
    );
  });
});
