import { act, fireEvent, render, screen } from '@testing-library/react';

import { AttributeChip, attributeOrder } from './AttributeChip';

const hover = (element: HTMLElement) => {
  fireEvent.mouseOver(element);
  fireEvent.mouseMove(element, { clientX: 1, clientY: 1 });
  fireEvent.mouseMove(element, { clientX: 4, clientY: 4 });
  act(() => {
    jest.advanceTimersByTime(600);
  });
};

describe('AttributeChip', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it.each([
    [
      'con',
      'CON',
      'Constitution',
      'Reduces the damage you take from missed Dailies and bad habits.',
    ],
    [
      'int',
      'INT',
      'Intelligence',
      'Raises the XP you earn and your maximum mana.',
    ],
    [
      'per',
      'PER',
      'Perception',
      'Raises the Gold you earn and your chance of finding items.',
    ],
    [
      'str',
      'STR',
      'Strength',
      'Raises damage to bosses and your chance of critical hits.',
    ],
  ] as const)(
    'explains %s in a tooltip',
    (attribute, short, title, description) => {
      render(<AttributeChip attribute={attribute} />);

      const chip = screen.getByText(short);

      hover(chip);

      const tooltip = screen.getByRole('tooltip');

      expect(tooltip.textContent).toContain(title);
      expect(tooltip.textContent).toContain(description);
    },
  );
});

describe('attributeOrder', () => {
  it('lists attributes in the order Habitica does', () => {
    expect(attributeOrder).toEqual(['str', 'int', 'con', 'per']);
  });
});
