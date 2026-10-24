import { getCurrentPhase, roadmap } from './roadmap';

describe('roadmap', () => {
  it('has exactly one phase in progress', () => {
    expect(roadmap.filter(phase => phase.status === 'now')).toHaveLength(1);
    expect(getCurrentPhase().codename).toBe('Anti-Cheese');
  });

  it('dates every shipped phase', () => {
    for (const phase of roadmap.filter(({ status }) => status === 'shipped')) {
      expect(phase.shippedAt).toMatch(/^\d{4}-\d{2}$/);
    }
  });

  it('uses unique codenames', () => {
    const codenames = roadmap.map(phase => phase.codename);

    expect(new Set(codenames).size).toBe(codenames.length);
  });

  it('runs from shipped to exploring', () => {
    const order = ['shipped', 'now', 'next', 'later', 'exploring'];
    const ranks = roadmap.map(phase => order.indexOf(phase.status));

    expect([...ranks].sort((a, b) => a - b)).toEqual(ranks);
  });
});
