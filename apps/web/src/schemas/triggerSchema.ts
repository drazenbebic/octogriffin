import { z } from 'zod';

export const triggerSchema = z.object({
  isActive: z.boolean().optional(),
  event: z.string().min(1, 'Please select a trigger event'),
  repositories: z
    .array(z.string())
    .min(1, 'Please select at least one repository'),
  taskTitle: z.string().min(1, 'Task title is required').max(255),
  taskNote: z
    .string()
    .max(255, 'Please keep your note under 255 characters.')
    .optional(),
  scoreDirection: z.enum(['up', 'down']),
  taskPriority: z.coerce.number(),
  taskAttribute: z.enum(['str', 'int', 'con', 'per']),
  taskFrequency: z.enum(['daily', 'weekly', 'monthly']),
  taskAlias: z.string().optional(),
  taskTags: z.string().optional(),
});

export type TriggerSchema = z.infer<typeof triggerSchema>;
