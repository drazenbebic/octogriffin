/** Triggers whose title or event contains the query, ignoring case. */
export const filterTriggers = <T extends { event: string; taskTitle: string }>(
  triggers: T[],
  query: string,
): T[] => {
  const needle = query.trim().toLowerCase();

  if (!needle) {
    return triggers;
  }

  return triggers.filter(
    ({ event, taskTitle }) =>
      taskTitle.toLowerCase().includes(needle) ||
      event.toLowerCase().includes(needle),
  );
};
