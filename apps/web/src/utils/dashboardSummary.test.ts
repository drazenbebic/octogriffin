import { dashboardSummary } from './dashboardSummary';

describe('dashboardSummary', () => {
  it('counts triggers and repositories', () => {
    expect(dashboardSummary(7, 3)).toBe('7 triggers across 3 repositories');
  });

  it('uses the singular for one of each', () => {
    expect(dashboardSummary(1, 1)).toBe('1 trigger across 1 repository');
  });

  it('invites a first trigger when there are none', () => {
    expect(dashboardSummary(0, 2)).toBe(
      'No triggers yet across 2 repositories',
    );
  });
});
