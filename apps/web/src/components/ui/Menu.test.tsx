import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Menu, MenuItem } from './Menu';

const renderMenu = () =>
  render(
    <Menu label="Account menu" trigger={<button type="button">Open</button>}>
      <MenuItem href="/profile">Profile</MenuItem>
      <MenuItem href="/dashboard/settings">Habitica settings</MenuItem>
      <MenuItem onClick={() => {}} tone="danger">
        Sign out
      </MenuItem>
    </Menu>,
  );

describe('Menu', () => {
  it('opens on click and lists its items', async () => {
    renderMenu();

    fireEvent.click(screen.getByRole('button', { name: 'Account menu' }));

    const menu = await screen.findByRole('menu');

    expect(menu).toBeTruthy();
    expect(
      screen.getAllByRole('menuitem').map(item => item.textContent),
    ).toEqual(['Profile', 'Habitica settings', 'Sign out']);
  });

  // Focus return is Ariakit's job and waits for transition events jsdom
  // never fires, so it's checked in the browser instead.
  it('closes on Escape', async () => {
    renderMenu();

    const trigger = screen.getByRole('button', { name: 'Account menu' });

    fireEvent.click(trigger);
    const menu = await screen.findByRole('menu');

    await waitFor(() =>
      expect(menu.contains(document.activeElement)).toBe(true),
    );
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });

    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
