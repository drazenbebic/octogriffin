import type { HabiticaAttribute } from '@/components/ui/AttributeChip';
import type { TriggerSchema } from '@/schemas/triggerSchema';
import { formatCooldown, toCooldownSeconds } from '@/utils/cooldown';
import { getDifficulty } from '@/utils/difficulty';

export type TriggerSentencePart =
  | { attribute: HabiticaAttribute; kind: 'attribute' }
  | { kind: 'difficulty'; label: string; stars: number }
  | { kind: 'event'; text: string }
  | { kind: 'placeholder'; text: string }
  | { kind: 'text'; text: string }
  | { kind: 'value'; text: string; tone?: 'hp' | 'ok' };

/**
 * "octogriffin", "octogriffin and 1 more" or "all 3 repositories".
 */
export const describeRepositories = (
  selectedNames: string[],
  totalConnected: number,
): string => {
  if (selectedNames.length === 0) {
    return '';
  }

  if (selectedNames.length > 1 && selectedNames.length === totalConnected) {
    return `all ${totalConnected} repositories`;
  }

  if (selectedNames.length === 1) {
    return selectedNames[0];
  }

  return `${selectedNames[0]} and ${selectedNames.length - 1} more`;
};

/** "octogriffin", "All 3 repos" or "2 repos", for the table cell. */
export const summariseRepositories = (names: string[], total: number) => {
  if (names.length === 0) {
    return 'None';
  }

  if (names.length === 1) {
    return names[0];
  }

  return names.length === total
    ? `All ${total} repos`
    : `${names.length} repos`;
};

const text = (value: string): TriggerSentencePart => ({
  kind: 'text',
  text: value,
});

const placeholder = (value: string): TriggerSentencePart => ({
  kind: 'placeholder',
  text: value,
});

/**
 * A trigger as a plain sentence, split into parts so each value can be
 * highlighted, e.g. "When push happens in octogriffin, score …".
 */
export const describeTrigger = (
  values: Partial<TriggerSchema>,
  ctx: {
    /** Recipes have no repositories yet, so they skip "happens in …". */
    omitRepositories?: boolean;
    repoNames: string[];
    totalRepos: number;
  },
): TriggerSentencePart[] => {
  const repositories = describeRepositories(ctx.repoNames, ctx.totalRepos);
  // Form values arrive as strings, an empty one means no cooldown
  const cooldownSeconds = toCooldownSeconds(
    Number(values.cooldownAmount) || undefined,
    values.cooldownUnit,
  );
  const difficulty =
    values.taskPriority !== undefined
      ? getDifficulty(values.taskPriority)
      : null;

  return [
    text('When '),
    values.event
      ? { kind: 'event', text: values.event }
      : placeholder('an event'),
    ...(ctx.omitRepositories
      ? [text(' happens, score ')]
      : [
          text(' happens in '),
          repositories
            ? ({ kind: 'value', text: repositories } as const)
            : placeholder('your repositories'),
          text(', score '),
        ]),
    values.taskTitle
      ? { kind: 'value', text: `“${values.taskTitle}”` }
      : placeholder('a habit'),
    text(difficulty?.label === 'Easy' ? ' as an ' : ' as a '),
    difficulty
      ? { kind: 'difficulty', label: difficulty.label, stars: difficulty.stars }
      : placeholder('difficulty'),
    ...(values.taskAttribute
      ? [
          text(' '),
          { attribute: values.taskAttribute, kind: 'attribute' } as const,
        ]
      : []),
    text(' habit and '),
    values.scoreDirection === 'down'
      ? { kind: 'value', text: 'take health', tone: 'hp' }
      : values.scoreDirection === 'up'
        ? { kind: 'value', text: 'reward you', tone: 'ok' }
        : placeholder('reward you'),
    text('. The counter resets '),
    values.taskFrequency
      ? { kind: 'value', text: values.taskFrequency }
      : placeholder('daily'),
    text('.'),
    ...(cooldownSeconds
      ? [
          text(' After scoring, it rests for '),
          { kind: 'value', text: formatCooldown(cooldownSeconds) } as const,
          text('.'),
        ]
      : []),
  ];
};
