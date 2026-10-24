export type DayPreferences = {
  /** The hour, 0 to 24, a new day starts. */
  dayStart: number;
  /** Minutes behind UTC, like `Date.getTimezoneOffset`: Vienna in summer is -120. */
  timezoneOffset: number;
};

const MINUTE_MS = 60_000;

// The same limits Habitica's cron applies, in `sanitizeOptions`. It checks
// -720..840 on the negated offset, so UTC-12 to UTC+14 is 720 to -840 here.
const isValidOffset = (offset: number) =>
  Number.isFinite(offset) && offset >= -840 && offset <= 720;

const isValidDayStart = (dayStart: number) =>
  Number.isFinite(dayStart) && dayStart >= 0 && dayStart <= 24;

/**
 * The user's current day in Habitica, "YYYY-MM-DD", the day their Dailies and
 * habit counters belong to.
 */
export const getHabiticaDay = (
  now: Date,
  { dayStart, timezoneOffset }: DayPreferences,
) => {
  const offset = isValidOffset(timezoneOffset) ? timezoneOffset : 0;
  const startHour = isValidDayStart(dayStart) ? dayStart : 0;

  // Local time, read through the UTC getters. Before the day starts it's
  // still yesterday.
  const local = new Date(
    now.getTime() - offset * MINUTE_MS - startHour * 60 * MINUTE_MS,
  );

  return local.toISOString().slice(0, 10);
};
