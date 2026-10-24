import { render, screen } from '@testing-library/react';

import { Heading } from './Heading';

describe('Heading', () => {
  it('renders level 1 as an h1 in the display font at 36px', () => {
    render(<Heading level={1}>Dashboard</Heading>);

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading.classList.contains('font-display')).toBe(true);
    expect(heading.classList.contains('text-[36px]')).toBe(true);
  });

  it('renders the h4 size in the body font', () => {
    render(
      <Heading level={2} size="h4">
        Connected repositories
      </Heading>,
    );

    const heading = screen.getByRole('heading', { level: 2 });

    expect(heading.classList.contains('font-sans')).toBe(true);
    expect(heading.classList.contains('font-semibold')).toBe(true);
    expect(heading.classList.contains('font-display')).toBe(false);
  });
});
