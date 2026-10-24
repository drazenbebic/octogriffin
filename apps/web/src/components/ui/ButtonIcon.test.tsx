import { RefreshIcon } from '@hugeicons/core-free-icons';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { ButtonIcon } from './ButtonIcon';

describe('ButtonIcon', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('is named by its label and shows it as a tooltip on hover', () => {
    render(<ButtonIcon icon={RefreshIcon} label="Refresh triggers" />);

    const button = screen.getByRole('button', { name: 'Refresh triggers' });

    // Ariakit only shows on hover after the pointer actually moves
    fireEvent.mouseOver(button);
    fireEvent.mouseMove(button, { clientX: 1, clientY: 1 });
    fireEvent.mouseMove(button, { clientX: 4, clientY: 4 });
    act(() => {
      jest.advanceTimersByTime(600);
    });

    // A label tooltip is wired through aria-labelledby, not role="tooltip"
    const tooltip = document.getElementById(
      button.getAttribute('aria-labelledby') ?? '',
    );

    expect(tooltip?.hidden).toBe(false);
    expect(tooltip?.textContent).toContain('Refresh triggers');
  });

  it('does not set a native title attribute', () => {
    render(<ButtonIcon icon={RefreshIcon} label="Refresh triggers" />);

    const button = screen.getByRole('button', { name: 'Refresh triggers' });

    expect(button.hasAttribute('title')).toBe(false);
  });
});
