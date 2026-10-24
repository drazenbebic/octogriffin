import { getHabiticaDay } from './habiticaDay';

const utc = (iso: string) => new Date(iso);

describe('getHabiticaDay', () => {
  it('uses the UTC date without an offset', () => {
    expect(
      getHabiticaDay(utc('2026-10-24T23:59:00Z'), {
        dayStart: 0,
        timezoneOffset: 0,
      }),
    ).toBe('2026-10-24');
  });

  it('is already tomorrow in Vienna in summer', () => {
    expect(
      getHabiticaDay(utc('2026-07-01T22:30:00Z'), {
        dayStart: 0,
        timezoneOffset: -120,
      }),
    ).toBe('2026-07-02');
  });

  it('is still yesterday in California', () => {
    expect(
      getHabiticaDay(utc('2026-10-24T05:00:00Z'), {
        dayStart: 0,
        timezoneOffset: 420,
      }),
    ).toBe('2026-10-23');
  });

  it('is still yesterday before a custom day start', () => {
    expect(
      getHabiticaDay(utc('2026-10-24T03:00:00Z'), {
        dayStart: 4,
        timezoneOffset: 0,
      }),
    ).toBe('2026-10-23');
  });

  it('starts the day at the custom day start', () => {
    expect(
      getHabiticaDay(utc('2026-10-24T04:00:00Z'), {
        dayStart: 4,
        timezoneOffset: 0,
      }),
    ).toBe('2026-10-24');
  });

  it('crosses a year boundary', () => {
    expect(
      getHabiticaDay(utc('2027-01-01T02:00:00Z'), {
        dayStart: 4,
        timezoneOffset: 0,
      }),
    ).toBe('2026-12-31');
  });

  it('falls back to UTC for an offset Habitica would reject', () => {
    expect(
      getHabiticaDay(utc('2026-10-24T23:00:00Z'), {
        dayStart: 0,
        timezoneOffset: -900,
      }),
    ).toBe('2026-10-24');
  });

  it('treats a day start Habitica would reject as midnight', () => {
    expect(
      getHabiticaDay(utc('2026-10-24T23:00:00Z'), {
        dayStart: 30,
        timezoneOffset: 0,
      }),
    ).toBe('2026-10-24');
  });

  it('treats a day start that is not a number as midnight', () => {
    expect(
      getHabiticaDay(utc('2026-10-24T00:30:00Z'), {
        dayStart: Number.NaN,
        timezoneOffset: 0,
      }),
    ).toBe('2026-10-24');
  });

  it('is already tomorrow in New Zealand in summer', () => {
    expect(
      getHabiticaDay(utc('2026-10-24T12:00:00Z'), {
        dayStart: 0,
        timezoneOffset: -780,
      }),
    ).toBe('2026-10-25');
  });

  it('accepts the easternmost time zone', () => {
    expect(
      getHabiticaDay(utc('2026-10-24T10:30:00Z'), {
        dayStart: 0,
        timezoneOffset: -840,
      }),
    ).toBe('2026-10-25');
  });

  it('accepts the westernmost time zone', () => {
    expect(
      getHabiticaDay(utc('2026-10-24T11:00:00Z'), {
        dayStart: 0,
        timezoneOffset: 720,
      }),
    ).toBe('2026-10-23');
  });

  it('falls back to UTC for an offset west of every time zone', () => {
    expect(
      getHabiticaDay(utc('2026-10-24T10:00:00Z'), {
        dayStart: 0,
        timezoneOffset: 800,
      }),
    ).toBe('2026-10-24');
  });
});
