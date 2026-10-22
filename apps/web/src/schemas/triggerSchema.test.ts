import { getGroupedGithubEvents } from '@/utils/githubEvents';

import { triggerSchema } from './triggerSchema';

const validTrigger = {
  event: 'push',
  repositories: ['repository-uuid'],
  scoreDirection: 'up',
  taskAttribute: 'str',
  taskFrequency: 'daily',
  taskPriority: 1,
  taskTitle: 'Write code',
};

describe('triggerSchema', () => {
  it('accepts every event offered in the dashboard', () => {
    const rejected = getGroupedGithubEvents()
      .map(({ value }) => value)
      .filter(
        event => !triggerSchema.safeParse({ ...validTrigger, event }).success,
      );

    expect(rejected).toEqual([]);
  });

  it('rejects events Octogriffin does not handle', () => {
    const result = triggerSchema.safeParse({
      ...validTrigger,
      event: 'installation.created',
    });

    expect(result.success).toBe(false);
  });
});
