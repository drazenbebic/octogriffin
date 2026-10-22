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

  it.each(['', 'write-code', 'Write_Code_2'])(
    'accepts the alias "%s"',
    taskAlias => {
      expect(
        triggerSchema.safeParse({ ...validTrigger, taskAlias }).success,
      ).toBe(true);
    },
  );

  it.each(['../user', 'write code', 'x'.repeat(256)])(
    'rejects the alias "%s"',
    taskAlias => {
      expect(
        triggerSchema.safeParse({ ...validTrigger, taskAlias }).success,
      ).toBe(false);
    },
  );

  it.each(['0.1', 1, 1.5, '2'])('accepts the difficulty %s', taskPriority => {
    expect(
      triggerSchema.safeParse({ ...validTrigger, taskPriority }).success,
    ).toBe(true);
  });

  it.each([0, 3, 'hard'])('rejects the difficulty %s', taskPriority => {
    expect(
      triggerSchema.safeParse({ ...validTrigger, taskPriority }).success,
    ).toBe(false);
  });

  it('rejects events Octogriffin does not handle', () => {
    const result = triggerSchema.safeParse({
      ...validTrigger,
      event: 'installation.created',
    });

    expect(result.success).toBe(false);
  });
});
