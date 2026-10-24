import { rewardableWebhooks } from '@/app/api/v1/webhook/webhookConstants';

import { getEventLabel, getGroupedGithubEvents } from './githubEvents';

const findEvent = (value: string) =>
  getGroupedGithubEvents().find(event => event.value === value);

describe('getGroupedGithubEvents', () => {
  it('offers every event a trigger can reward', () => {
    expect(
      getGroupedGithubEvents()
        .map(({ value }) => value)
        .sort(),
    ).toEqual([...rewardableWebhooks].sort());
  });

  it('keeps each group together in the picker', () => {
    const groups = getGroupedGithubEvents().map(({ group }) => group);
    const runs = groups.filter((group, index) => group !== groups[index - 1]);

    expect(runs).toEqual([...new Set(groups)]);
    expect(runs.indexOf('Pull Request')).toBeLessThan(
      runs.indexOf('Pull Request Review'),
    );
  });

  it('names events after their type and action', () => {
    expect(findEvent('pull_request_review.submitted')).toEqual({
      group: 'Pull Request Review',
      label: 'Pull Request Review Submitted',
      value: 'pull_request_review.submitted',
    });
    expect(findEvent('fork')).toEqual({
      group: 'Fork',
      label: 'Fork',
      value: 'fork',
    });
  });

  it('keeps small words lowercase', () => {
    expect(findEvent('pull_request.ready_for_review')?.label).toBe(
      'Pull Request Ready for Review',
    );
    expect(findEvent('pull_request.converted_to_draft')?.label).toBe(
      'Pull Request Converted to Draft',
    );
  });

  it('gives pushes a friendlier name', () => {
    expect(findEvent('push')?.label).toBe('Push to Repository');
  });
});

describe('getEventLabel', () => {
  it('returns the readable label the event picker uses', () => {
    expect(getEventLabel('pull_request.opened')).toBe('Pull Request Opened');
    expect(getEventLabel('push')).toBe('Push to Repository');
  });

  it('falls back to the raw event for events it does not know', () => {
    expect(getEventLabel('made_up.event')).toBe('made_up.event');
  });
});
