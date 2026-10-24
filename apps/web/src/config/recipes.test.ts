import { isRewardableWebhook } from '@/app/api/v1/webhook/webhookConstants';

import { recipes } from './recipes';

describe('recipes', () => {
  it('has the five coding habit recipes', () => {
    expect(recipes.map(recipe => recipe.slug)).toEqual([
      'code-every-day',
      'ship-pull-requests',
      'review-code',
      'close-issues',
      'ship-a-release',
    ]);
  });

  it('keeps the settings the docs page used to list', () => {
    expect(recipes.map(({ preset }) => preset)).toEqual([
      expect.objectContaining({
        event: 'push',
        taskAttribute: 'str',
        taskFrequency: 'daily',
        taskPriority: 0.1,
        taskTitle: 'Pushed code',
      }),
      expect.objectContaining({
        event: 'pull_request.opened',
        taskAttribute: 'str',
        taskFrequency: 'weekly',
        taskPriority: 1,
        taskTitle: 'Opened a pull request',
      }),
      expect.objectContaining({
        event: 'pull_request_review.submitted',
        taskAttribute: 'int',
        taskFrequency: 'weekly',
        taskPriority: 1.5,
        taskTitle: 'Reviewed a pull request',
      }),
      expect.objectContaining({
        event: 'issues.closed',
        taskAttribute: 'con',
        taskFrequency: 'weekly',
        taskPriority: 1,
        taskTitle: 'Closed an issue',
      }),
      expect.objectContaining({
        event: 'release.published',
        taskAttribute: 'per',
        taskFrequency: 'monthly',
        taskPriority: 2,
        taskTitle: 'Published a release',
      }),
    ]);
  });

  it('only uses events Octogriffin can reward, and unique slugs', () => {
    expect(
      recipes.every(({ preset }) => isRewardableWebhook(preset.event)),
    ).toBe(true);
    expect(new Set(recipes.map(recipe => recipe.slug)).size).toBe(
      recipes.length,
    );
  });

  it('tells you what to do next after adding each recipe', () => {
    expect(recipes.map(recipe => recipe.successHint)).toEqual([
      'Push a commit',
      'Open a pull request',
      'Review a pull request',
      'Close an issue',
      'Publish a release',
    ]);
  });
});
