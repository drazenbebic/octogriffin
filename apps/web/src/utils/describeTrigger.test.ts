import type { TriggerSentencePart } from './describeTrigger';
import {
  describeRepositories,
  describeTrigger,
  summariseRepositories,
} from './describeTrigger';

const toText = (parts: TriggerSentencePart[]) =>
  parts
    .map(part => {
      if (part.kind === 'difficulty') {
        return part.label;
      }

      if (part.kind === 'attribute') {
        return part.attribute.toUpperCase();
      }

      return part.text;
    })
    .join('');

describe('describeRepositories', () => {
  it('names a single repository', () => {
    expect(describeRepositories(['octogriffin'], 3)).toBe('octogriffin');
  });

  it('names the first and counts the rest', () => {
    expect(describeRepositories(['a', 'b'], 3)).toBe('a and 1 more');
  });

  it('says "all" when every connected repository is selected', () => {
    expect(describeRepositories(['a', 'b', 'c'], 3)).toBe('all 3 repositories');
  });

  it('is empty when nothing is selected', () => {
    expect(describeRepositories([], 3)).toBe('');
  });
});

describe('describeTrigger', () => {
  it('reads a complete trigger as one sentence', () => {
    const parts = describeTrigger(
      {
        event: 'pull_request.opened',
        scoreDirection: 'up',
        taskAttribute: 'str',
        taskFrequency: 'weekly',
        taskPriority: 1,
        taskTitle: 'Opened a pull request',
      },
      { repoNames: ['octogriffin', 'bebic.dev'], totalRepos: 3 },
    );

    expect(toText(parts)).toBe(
      'When pull_request.opened happens in octogriffin and 1 more, score “Opened a pull request” as an Easy STR habit and reward you. The counter resets weekly.',
    );
  });

  it('marks a punishing trigger in the health colour', () => {
    const parts = describeTrigger(
      { scoreDirection: 'down' },
      { repoNames: [], totalRepos: 0 },
    );

    expect(parts).toContainEqual({
      kind: 'value',
      text: 'take health',
      tone: 'hp',
    });
  });

  it('uses placeholders for missing values', () => {
    const parts = describeTrigger({}, { repoNames: [], totalRepos: 2 });
    const placeholders = parts
      .filter(part => part.kind === 'placeholder')
      .map(part => part.text);

    expect(placeholders).toEqual(
      expect.arrayContaining(['an event', 'your repositories', 'a habit']),
    );
  });

  it('shows an event that is no longer supported by its raw ID', () => {
    const parts = describeTrigger(
      { event: 'some_removed.event' },
      { repoNames: [], totalRepos: 0 },
    );

    expect(parts).toContainEqual({ kind: 'event', text: 'some_removed.event' });
  });

  it('uses "a" before difficulties that start with a consonant', () => {
    const parts = describeTrigger(
      { taskPriority: 2 },
      { repoNames: [], totalRepos: 0 },
    );

    expect(toText(parts)).toContain(' as a Hard ');
  });
});

describe('summariseRepositories', () => {
  it('names a single repository', () => {
    expect(summariseRepositories(['octogriffin'], 3)).toBe('octogriffin');
  });

  it('says "All" when every connected repository is used', () => {
    expect(summariseRepositories(['a', 'b', 'c'], 3)).toBe('All 3 repos');
  });

  it('counts a partial selection', () => {
    expect(summariseRepositories(['a', 'b'], 3)).toBe('2 repos');
  });

  it('says "None" for a trigger without repositories', () => {
    expect(summariseRepositories([], 3)).toBe('None');
  });
});
