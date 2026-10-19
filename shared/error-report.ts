import { z } from 'zod';

export const ErrorReportSchema = z.object({
  type: z.string().max(100),
  message: z.string().max(1000),
  component: z.string().max(300),
  page: z.string().max(300),
  browser: z.string().max(50),
});

export type ErrorReport = z.infer<typeof ErrorReportSchema>;
