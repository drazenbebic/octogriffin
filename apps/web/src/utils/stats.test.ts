import { barPercent, countTriggersByRepository } from './stats';

describe('barPercent', () => {
  it('turns a value and maximum into a percentage', () => {
    expect(barPercent(42, 50)).toBe(84);
  });

  it('never divides by zero for brand-new accounts', () => {
    expect(barPercent(5, 0)).toBe(0);
  });

  it('clamps below 0 and above 100', () => {
    expect(barPercent(-3, 10)).toBe(0);
    expect(barPercent(70, 50)).toBe(100);
  });

  it('treats values that are not numbers as empty', () => {
    expect(barPercent(Number.NaN, 10)).toBe(0);
    expect(barPercent(5, Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe('countTriggersByRepository', () => {
  it('counts each trigger once for every repository it lists', () => {
    const counts = countTriggersByRepository([
      { repositories: [{ uuid: 'a' }, { uuid: 'b' }] },
      { repositories: [{ uuid: 'a' }] },
      { repositories: [] },
    ]);

    expect(counts.get('a')).toBe(2);
    expect(counts.get('b')).toBe(1);
    expect(counts.get('c')).toBeUndefined();
  });
});
