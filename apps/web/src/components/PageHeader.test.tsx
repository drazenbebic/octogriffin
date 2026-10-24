import { render, screen } from '@testing-library/react';

import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('shows the page title as the only h1, with its description', () => {
    render(<PageHeader description="Everything about setup." title="FAQ" />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    screen.getByRole('heading', { level: 1, name: 'FAQ' });
    screen.getByText('Everything about setup.');
  });

  it('puts extra details, like a date, beside the title', () => {
    render(
      <PageHeader aside={<span>Last updated today</span>} title="Terms" />,
    );

    expect(screen.getByText('Last updated today')).toBeTruthy();
  });
});
