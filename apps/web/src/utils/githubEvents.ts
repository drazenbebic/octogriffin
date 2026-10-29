import type { ComboboxItemType } from '@/components/ui/Combobox';
import { rewardableEvents } from '@/webhooks/webhookEvents';

// Labels that don't follow from the event name.
const labelOverrides: Record<string, string> = {
  push: 'Push to Repository',
};

const lowercaseWords = new Set(['for', 'to']);

const toTitle = (words: string) =>
  words
    .split('_')
    .map((word, index) =>
      index > 0 && lowercaseWords.has(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ');

/**
 * Every event a trigger can reward, grouped by type for the event picker,
 * e.g. `pull_request.opened` becomes "Pull Request Opened" in "Pull Request".
 */
export const getGroupedGithubEvents = (): ComboboxItemType[] =>
  [...rewardableEvents]
    .map(value => {
      const [type, action] = value.split('.');
      const group = toTitle(type);

      return {
        group,
        label:
          labelOverrides[value] ??
          (action ? `${group} ${toTitle(action)}` : group),
        value,
      };
    })
    // Alphabetical by what the picker shows: group first, then label.
    .sort(
      (a, b) =>
        a.group.localeCompare(b.group) || a.label.localeCompare(b.label),
    );

let eventLabels: Map<string, string> | undefined;

/**
 * The readable label for an event, e.g. "Pull Request Opened", or the raw
 * event when Octogriffin doesn't reward it.
 */
export const getEventLabel = (event: string): string => {
  eventLabels ??= new Map(
    getGroupedGithubEvents().map(({ label, value }) => [value, label]),
  );

  return eventLabels.get(event) ?? event;
};

/**
 * The part of a label after its group, so a list under "Discussion" reads
 * "Answered", not "Discussion Answered". Labels that are just the group, or
 * read on from it ("Push to Repository"), stay whole.
 */
export const getActionLabel = (label: string, group: string): string => {
  const rest = label.slice(group.length + 1);

  return label.startsWith(`${group} `) && /^[A-Z]/.test(rest) ? rest : label;
};

/** Events whose label or ID contains the query, ignoring case. */
export const filterEvents = <T extends { label: string; value: string }>(
  events: T[],
  query: string,
): T[] => {
  const needle = query.trim().toLowerCase();

  if (!needle) {
    return events;
  }

  return events.filter(
    ({ label, value }) =>
      label.toLowerCase().includes(needle) || value.includes(needle),
  );
};
