import { z } from 'zod';

export const habiticaUserSchema = z.object({
  githubUserId: z.bigint().optional(),
  userId: z.string().min(1, 'Please enter your Habitica User ID'),
  apiToken: z.string().min(1, 'Please enter your Habitica API Token'),
});

export type HabiticaUserSchema = z.infer<typeof habiticaUserSchema>;
