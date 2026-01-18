import { z } from 'zod';

export const toggleTriggerSchema = z.object({
  uuid: z.string().min(1, 'Please provide the trigger UUID'),
  isActive: z.boolean(),
});

export type ToggleTriggerSchema = z.infer<typeof toggleTriggerSchema>;
