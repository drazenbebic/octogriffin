export const cooldownUnits = ['days', 'hours', 'minutes', 'seconds'] as const;

export type CooldownUnit = (typeof cooldownUnits)[number];

export const SECONDS_PER_UNIT: Record<CooldownUnit, number> = {
  days: 86_400,
  hours: 3600,
  minutes: 60,
  seconds: 1,
};

/** 365 days. */
export const MAX_COOLDOWN_SECONDS = 31_536_000;

// By size, as linting keeps `cooldownUnits` in alphabetical order
const largestUnitFirst = [...cooldownUnits].sort(
  (a, b) => SECONDS_PER_UNIT[b] - SECONDS_PER_UNIT[a],
);

const longLabels: Record<CooldownUnit, [string, string]> = {
  days: ['day', 'days'],
  hours: ['hour', 'hours'],
  minutes: ['minute', 'minutes'],
  seconds: ['second', 'seconds'],
};

const shortLabels: Record<CooldownUnit, [string, string]> = {
  days: ['day', 'days'],
  hours: ['hr', 'hr'],
  minutes: ['min', 'min'],
  seconds: ['sec', 'sec'],
};

/**
 * Compares against the unit's own maximum, so a huge amount never has to be
 * multiplied into seconds first.
 */
export const isWithinMaxCooldown = (amount: number, unit: CooldownUnit) =>
  amount <= MAX_COOLDOWN_SECONDS / SECONDS_PER_UNIT[unit];

export const toCooldownSeconds = (
  amount: number | undefined,
  unit: CooldownUnit = 'minutes',
): null | number =>
  amount === undefined ? null : amount * SECONDS_PER_UNIT[unit];

/** In the largest unit that divides evenly, e.g. 600 → 10 minutes. */
export const fromCooldownSeconds = (
  seconds: number,
): { amount: number; unit: CooldownUnit } => {
  const unit =
    largestUnitFirst.find(
      candidate => seconds % SECONDS_PER_UNIT[candidate] === 0,
    ) ?? 'seconds';

  return { amount: seconds / SECONDS_PER_UNIT[unit], unit };
};

/** "10 minutes", or "10 min" for the short style. */
export const formatCooldown = (
  seconds: number,
  style: 'long' | 'short' = 'long',
) => {
  const { amount, unit } = fromCooldownSeconds(seconds);
  const [singular, plural] = (style === 'long' ? longLabels : shortLabels)[
    unit
  ];

  return `${amount} ${amount === 1 ? singular : plural}`;
};
