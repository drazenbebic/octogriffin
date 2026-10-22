import { z } from 'zod';

export const habiticaUserSchema = z.object({
  githubUserId: z.bigint().optional(),
  userId: z.string().min(1, 'Please enter your Habitica User ID'),
  // Left empty to keep the saved token
  apiToken: z.string().optional(),
});

export type HabiticaUserSchema = z.infer<typeof habiticaUserSchema>;
