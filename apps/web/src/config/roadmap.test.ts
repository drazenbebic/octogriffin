import { getCurrentPhase, roadmap } from './roadmap';

describe('roadmap', () => {
  it('has exactly one phase in progress', () => {
    expect(roadmap.filter(phase => phase.status === 'now')).toHaveLength(1);
    expect(getCurrentPhase().codename).toBe('Ledger');
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

describe('roadmap releases', () => {
  it('links every shipped phase to the release it shipped in', () => {
    expect(
      roadmap
        .filter(({ status }) => status === 'shipped')
        .map(({ codename, release }) => [codename, release]),
    ).toEqual([
      ['Foundations', 'web-v0.4.0'],
      ['Control Freak', 'web-v0.7.0'],
      ['Dark mode', 'web-v0.8.0'],
      ['Field Guide', 'web-v0.10.0'],
      ['Anti-Cheese', 'web-v0.11.0'],
    ]);
  });
});
