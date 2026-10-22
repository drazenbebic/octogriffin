import { z } from 'zod';

export const toggleTriggerSchema = z.object({
  isActive: z.boolean(),
  uuid: z.string().min(1, 'Please provide the trigger UUID'),
});

export type ToggleTriggerSchema = z.infer<typeof toggleTriggerSchema>;
