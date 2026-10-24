const dayKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const dayLabel = (date: Date, now: Date, locale?: string): string => {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (dayKey(date) === dayKey(now)) {
    return 'Today';
  }

  if (dayKey(date) === dayKey(yesterday)) {
    return 'Yesterday';
  }

  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  });
};

/**
 * Groups history entries by the viewer's local day: "Today", "Yesterday",
 * then dates, with the year only for earlier years.
 */
export const groupLogsByDay = <T extends { createdAt: Date | string }>(
  logs: T[],
  now: Date,
  locale?: string,
): { label: string; logs: T[] }[] => {
  const groups: { key: string; label: string; logs: T[] }[] = [];

  for (const log of logs) {
    const date = new Date(log.createdAt);
    const key = dayKey(date);
    const last = groups.at(-1);

    if (last?.key === key) {
      last.logs.push(log);
    } else {
      groups.push({ key, label: dayLabel(date, now, locale), logs: [log] });
    }
  }

  return groups.map(({ label, logs: groupLogs }) => ({
    label,
    logs: groupLogs,
  }));
};
