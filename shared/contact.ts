import { z } from 'zod';

export const ContactRequestSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name').max(100),
  email: z.email('Please enter a valid email address').max(254),
  message: z.string().trim().min(1, 'Please enter a message').max(5000),
  /** Hidden field. People leave it empty; form-filling bots do not. */
  website: z.string().max(200).optional(),
});

export type ContactRequest = z.infer<typeof ContactRequestSchema>;
