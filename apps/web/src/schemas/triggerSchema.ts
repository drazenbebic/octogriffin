import { z } from 'zod';

import { isRewardableWebhook } from '@/app/api/v1/webhook/webhookConstants';
import { TaskPriority } from '@/enums/habitica';
import { cooldownUnits, isWithinMaxCooldown } from '@/utils/cooldown';

const TASK_PRIORITIES: number[] = [
  TaskPriority.LOW,
  TaskPriority.NORMAL,
  TaskPriority.HIGH,
  TaskPriority.CRITICAL,
];

export const UNKNOWN_REPOSITORY_ERROR =
  'Please only select repositories you added Octogriffin to.';

export const triggerSchema = z
  .object({
    // An empty field means no cooldown
    cooldownAmount: z
      .preprocess(
        value => (value === '' ? undefined : value),
        z.coerce
          .number()
          .int('Please use a whole number.')
          .positive('Please use a number above 0.')
          .optional(),
      )
      .optional(),
    cooldownUnit: z.enum(cooldownUnits).optional(),
    event: z
      .string()
      .min(1, 'Please select a trigger event')
      .refine(isRewardableWebhook, 'Please select a supported trigger event'),
    isActive: z.boolean().optional(),
    repositories: z
      .array(z.string())
      .min(1, 'Please select at least one repository'),
    scoreDirection: z.enum(['up', 'down']),
    taskAlias: z
      .string()
      .max(255, 'Please keep your alias under 255 characters.')
      // The characters Habitica allows in an alias
      .regex(
        /^[\w-]*$/,
        'Please only use letters, numbers, dashes and underscores.',
      )
      .optional(),
    taskAttribute: z.enum(['str', 'int', 'con', 'per']),
    taskFrequency: z.enum(['daily', 'weekly', 'monthly']),
    taskNote: z
      .string()
      .max(255, 'Please keep your note under 255 characters.')
      .optional(),
    taskPriority: z.coerce
      .number()
      .refine(
        priority => TASK_PRIORITIES.includes(priority),
        'Please select a difficulty',
      ),
    taskTags: z.string().optional(),
    taskTitle: z.string().min(1, 'Task title is required').max(255),
  })
  .superRefine(({ cooldownAmount, cooldownUnit = 'minutes' }, ctx) => {
    if (
      cooldownAmount !== undefined &&
      !isWithinMaxCooldown(cooldownAmount, cooldownUnit)
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Please keep the cooldown to 365 days or less.',
        path: ['cooldownAmount'],
      });
    }
  });

export type TriggerSchema = z.infer<typeof triggerSchema>;
