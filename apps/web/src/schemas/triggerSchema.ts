import { z } from 'zod';

export const triggerSchema = z.object({
  event: z.string().min(1, 'Please select a trigger event'),
  isActive: z.boolean().optional(),
  repositories: z
    .array(z.string())
    .min(1, 'Please select at least one repository'),
  scoreDirection: z.enum(['up', 'down']),
  taskAlias: z.string().optional(),
  taskAttribute: z.enum(['str', 'int', 'con', 'per']),
  taskFrequency: z.enum(['daily', 'weekly', 'monthly']),
  taskNote: z
    .string()
    .max(255, 'Please keep your note under 255 characters.')
    .optional(),
  taskPriority: z.coerce.number(),
  taskTags: z.string().optional(),
  taskTitle: z.string().min(1, 'Task title is required').max(255),
});

export type TriggerSchema = z.infer<typeof triggerSchema>;
