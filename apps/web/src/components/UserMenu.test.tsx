import { fireEvent, render, screen } from '@testing-library/react';

import { UserMenu } from './UserMenu';

jest.mock('next/navigation', () => ({ usePathname: () => '/' }));

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: () => ({
    data: {
      user: { image: null, login: 'drazenbebic', name: 'Drazen Bebic' },
    },
    status: 'authenticated',
  }),
}));

describe('UserMenu', () => {
  it('puts profile, settings, history and sign out in one account menu', async () => {
    render(<UserMenu />);

    fireEvent.click(screen.getByRole('button', { name: 'Account menu' }));

    await screen.findByRole('menu');

    expect(
      screen.getAllByRole('menuitem').map(item => item.textContent),
    ).toEqual(['Profile', 'Habitica settings', 'History', 'Sign out']);
  });
});
