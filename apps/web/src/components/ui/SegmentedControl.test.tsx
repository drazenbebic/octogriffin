import { fireEvent, render, screen } from '@testing-library/react';

import { SegmentedControl } from './SegmentedControl';

const options = [
  { label: 'Daily', value: 'daily' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Weekly', value: 'weekly' },
] as const;

describe('SegmentedControl', () => {
  it('marks the current value as checked', () => {
    render(
      <SegmentedControl
        label="Counter resets"
        onChange={() => {}}
        options={[...options]}
        value="weekly"
      />,
    );

    screen.getByRole('radiogroup', { name: 'Counter resets' });

    expect(
      screen
        .getByRole('radio', { name: 'Weekly' })
        .getAttribute('aria-checked'),
    ).toBe('true');
    expect(
      screen.getByRole('radio', { name: 'Daily' }).getAttribute('aria-checked'),
    ).toBe('false');
  });

  // The segments are native radios, so the browser handles arrow keys
  // (which jsdom doesn't emulate); keyboard use is checked in the browser.
  it('reports the option that gets selected', () => {
    const onChange = jest.fn();

    render(
      <SegmentedControl
        label="Counter resets"
        onChange={onChange}
        options={[...options]}
        value="weekly"
      />,
    );

    fireEvent.click(screen.getByRole('radio', { name: 'Monthly' }));

    expect(onChange).toHaveBeenLastCalledWith('monthly');
  });
});
