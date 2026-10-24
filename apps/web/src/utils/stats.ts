/** A stat bar's fill as 0–100, safe for brand-new accounts with no maximum yet. */
export const barPercent = (value: number, max: number): number => {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) {
    return 0;
  }

  return Math.min(Math.max((value / max) * 100, 0), 100);
};

/** How many triggers use each repository, keyed by repository uuid. */
export const countTriggersByRepository = (
  triggers: { repositories: { uuid: string }[] }[],
): Map<string, number> => {
  const counts = new Map<string, number>();

  for (const trigger of triggers) {
    for (const { uuid } of trigger.repositories) {
      counts.set(uuid, (counts.get(uuid) ?? 0) + 1);
    }
  }

  return counts;
};
