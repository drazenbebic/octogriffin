import { render, screen, within } from '@testing-library/react';

import { LegalPage } from './LegalPage';

describe('LegalPage', () => {
  it('links to each section, without a legal page switcher', () => {
    render(
      <LegalPage
        sections={[
          { id: 'intro', label: 'Introduction', number: '1' },
          { id: 'controller', label: 'Controller', number: '2' },
        ]}
        title="Privacy policy"
        updated="2026-10-22"
      >
        <p>Body</p>
      </LegalPage>,
    );

    const toc = screen.getByRole('navigation', { name: 'On this page' });

    expect(
      within(toc)
        .getAllByRole('link')
        .map(link => link.getAttribute('href')),
    ).toEqual(['#intro', '#controller']);

    expect(screen.queryByRole('navigation', { name: 'Legal' })).toBeNull();
  });

  it('shows when the page was last updated', () => {
    render(
      <LegalPage title="Privacy policy" updated="2026-10-22">
        <p>Body</p>
      </LegalPage>,
    );

    const time = screen.getByText('22 October 2026');

    expect(time.tagName).toBe('TIME');
    expect(time.getAttribute('datetime')).toBe('2026-10-22');
  });
});
