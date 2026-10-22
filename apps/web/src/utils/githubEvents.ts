import { rewardableWebhooks } from '@/app/api/v1/webhook/webhookConstants';
import type { ComboboxItemType } from '@/components/ui/Combobox';

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
  [...rewardableWebhooks]
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
