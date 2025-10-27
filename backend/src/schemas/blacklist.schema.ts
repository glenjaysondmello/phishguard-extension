import { z } from 'zod';

export const blacklistSchema = z.object({
  domain: z.string().min(1).max(255).transform(s => s.toLowerCase().trim()),
  reason: z.string().max(1000).optional()
});

export type BlacklistInput = z.infer<typeof blacklistSchema>;