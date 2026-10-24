import { Dialog, DialogProvider } from '@ariakit/react';
import { ZapIcon } from '@hugeicons/core-free-icons';
import { render, screen } from '@testing-library/react';

import { DialogFooter, DialogHeader } from './DialogParts';

describe('DialogParts', () => {
  it('renders the title as a heading and a labelled close button', () => {
    render(
      <DialogProvider open>
        <Dialog portal={false}>
          <DialogHeader
            icon={ZapIcon}
            onCloseLabel="Close"
            title="New trigger"
          />
          <DialogFooter start="* Required">
            <button type="button">Create trigger</button>
          </DialogFooter>
        </Dialog>
      </DialogProvider>,
    );

    expect(screen.getByRole('heading', { name: 'New trigger' }).tagName).toBe(
      'H2',
    );
    screen.getByRole('button', { name: 'Close' });
    screen.getByText('* Required');
  });
});
