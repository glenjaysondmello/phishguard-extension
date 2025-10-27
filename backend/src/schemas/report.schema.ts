import { z } from "zod";

export const reportSchema = z.object({
  url: z.string().url(),
  pageTitle: z.string().max(512).optional(),
  userComment: z.string().max(1000).optional(),
  userAgent: z.string().max(512).optional(),
  fromExtension: z.boolean().optional()
});

export type ReportInput = z.infer<typeof reportSchema>;