import { groupLogsByDay } from './groupLogsByDay';

// Local times, so the test holds in any time zone
const at = (y: number, m: number, d: number, h: number, min = 0) =>
  new Date(y, m - 1, d, h, min);

describe('groupLogsByDay', () => {
  const now = at(2026, 10, 23, 9);

  it('groups by the viewer’s local date, keeping order within a day', () => {
    const logs = [
      { createdAt: at(2026, 10, 23, 8), id: 'a' },
      { createdAt: at(2026, 10, 23, 0, 5), id: 'b' },
      { createdAt: at(2026, 10, 22, 23, 55), id: 'c' },
      { createdAt: at(2025, 12, 31, 12), id: 'd' },
    ];

    const groups = groupLogsByDay(logs, now, 'en-GB');

    expect(groups.map(group => group.label)).toEqual([
      'Today',
      'Yesterday',
      '31 Dec 2025',
    ]);
    expect(groups[0].logs.map(log => log.id)).toEqual(['a', 'b']);
  });

  it('leaves the year off dates in the current year', () => {
    const groups = groupLogsByDay(
      [{ createdAt: at(2026, 10, 20, 12).toISOString() }],
      now,
      'en-GB',
    );

    expect(groups[0].label).toBe('20 Oct');
  });

  it('returns nothing for no logs', () => {
    expect(groupLogsByDay([], now)).toEqual([]);
  });
});
