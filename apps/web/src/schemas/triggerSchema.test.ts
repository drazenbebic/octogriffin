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

describe('triggerSchema cooldown', () => {
  it.each([undefined, ''])(
    'accepts an empty amount (%p) as no cooldown',
    cooldownAmount => {
      const result = triggerSchema.safeParse({
        ...validTrigger,
        cooldownAmount,
      });

      expect(result.success).toBe(true);
      expect(result.data?.cooldownAmount).toBeUndefined();
    },
  );

  it('coerces the amount from the form', () => {
    const result = triggerSchema.safeParse({
      ...validTrigger,
      cooldownAmount: '10',
      cooldownUnit: 'minutes',
    });

    expect(result.data?.cooldownAmount).toBe(10);
  });

  it.each([
    ['0', 'Please use a number above 0.'],
    ['-5', 'Please use a number above 0.'],
    ['1.5', 'Please use a whole number.'],
  ])('rejects %s', (cooldownAmount, message) => {
    const result = triggerSchema.safeParse({
      ...validTrigger,
      cooldownAmount,
      cooldownUnit: 'hours',
    });

    expect(result.error?.issues).toEqual([
      expect.objectContaining({ message, path: ['cooldownAmount'] }),
    ]);
  });

  it('accepts 365 days', () => {
    expect(
      triggerSchema.safeParse({
        ...validTrigger,
        cooldownAmount: 365,
        cooldownUnit: 'days',
      }).success,
    ).toBe(true);
  });

  it.each([
    [366, 'days'],
    [525_601, 'minutes'],
    [1_000_000_000, 'days'],
  ])('rejects %d %s', (cooldownAmount, cooldownUnit) => {
    const result = triggerSchema.safeParse({
      ...validTrigger,
      cooldownAmount,
      cooldownUnit,
    });

    expect(result.error?.issues).toEqual([
      expect.objectContaining({
        message: 'Please keep the cooldown to 365 days or less.',
        path: ['cooldownAmount'],
      }),
    ]);
  });

  it('checks the maximum in minutes when no unit is given', () => {
    expect(
      triggerSchema.safeParse({ ...validTrigger, cooldownAmount: 525_601 })
        .success,
    ).toBe(false);
  });

  it('rejects an unknown unit', () => {
    expect(
      triggerSchema.safeParse({
        ...validTrigger,
        cooldownAmount: 1,
        cooldownUnit: 'weeks',
      }).success,
    ).toBe(false);
  });
});
