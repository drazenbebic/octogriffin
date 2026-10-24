import {
  formatCooldown,
  fromCooldownSeconds,
  isWithinMaxCooldown,
  toCooldownSeconds,
} from './cooldown';

describe('toCooldownSeconds', () => {
  it.each([
    [10, 'minutes', 600],
    [2, 'hours', 7200],
    [365, 'days', 31_536_000],
    [90, 'seconds', 90],
  ] as const)('turns %d %s into %d seconds', (amount, unit, seconds) => {
    expect(toCooldownSeconds(amount, unit)).toBe(seconds);
  });

  it('is null without an amount', () => {
    expect(toCooldownSeconds(undefined, 'hours')).toBeNull();
  });

  it('defaults to minutes', () => {
    expect(toCooldownSeconds(5)).toBe(300);
  });
});

describe('fromCooldownSeconds', () => {
  it.each([
    [90, { amount: 90, unit: 'seconds' }],
    [600, { amount: 10, unit: 'minutes' }],
    [3600, { amount: 1, unit: 'hours' }],
    [5400, { amount: 90, unit: 'minutes' }],
    [86_400, { amount: 1, unit: 'days' }],
    [31_536_000, { amount: 365, unit: 'days' }],
  ])('turns %d seconds into %o', (seconds, expected) => {
    expect(fromCooldownSeconds(seconds)).toEqual(expected);
  });
});

describe('isWithinMaxCooldown', () => {
  it.each([
    [1_000_000_000, 'days', false],
    [31_536_000, 'seconds', true],
    [31_536_001, 'seconds', false],
    [365, 'days', true],
    [366, 'days', false],
    [525_600, 'minutes', true],
    [525_601, 'minutes', false],
    [8_760, 'hours', true],
    [8_761, 'hours', false],
  ] as const)('%d %s → %s', (amount, unit, expected) => {
    expect(isWithinMaxCooldown(amount, unit)).toBe(expected);
  });
});

describe('formatCooldown', () => {
  it.each([
    [1, 'long', '1 second'],
    [172_800, 'long', '2 days'],
    [172_800, 'short', '2 days'],
    [3600, 'long', '1 hour'],
    [600, 'long', '10 minutes'],
    [600, 'short', '10 min'],
    [7200, 'short', '2 hr'],
    [86_400, 'short', '1 day'],
    [90, 'long', '90 seconds'],
    [90, 'short', '90 sec'],
  ] as const)('formats %d (%s) as "%s"', (seconds, style, text) => {
    expect(formatCooldown(seconds, style)).toBe(text);
  });
});
