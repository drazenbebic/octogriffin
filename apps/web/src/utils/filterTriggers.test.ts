import { filterTriggers } from './filterTriggers';

const rows = [
  { event: 'pull_request.opened', taskTitle: 'Shipped a feature' },
  { event: 'push', taskTitle: 'Opened a pull request' },
  { event: 'issues.closed', taskTitle: 'Closed an issue' },
];

describe('filterTriggers', () => {
  it('matches the title or the event, ignoring case and surrounding spaces', () => {
    expect(filterTriggers(rows, ' PULL ').map(row => row.taskTitle)).toEqual([
      'Shipped a feature',
      'Opened a pull request',
    ]);
  });

  it('returns every trigger for an empty query', () => {
    expect(filterTriggers(rows, '')).toEqual(rows);
    expect(filterTriggers(rows, '   ')).toEqual(rows);
  });
});
