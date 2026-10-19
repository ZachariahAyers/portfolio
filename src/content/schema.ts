import { z } from 'zod';

/**
 * Schemas for the authored content in content/. Every fact in those files comes
 * from Zachariah's own records; the schemas only describe their shape.
 */

const httpsUrl = z.url({ protocol: /^https$/ });

const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  technologies: z.array(z.string()).default([]),
  current: z.boolean().optional(),
  url: httpsUrl.optional(),
  github: httpsUrl.optional(),
  caseStudy: z
    .string()
    .regex(/^\/casestudies\/[a-z0-9-]+$/)
    .optional(),
});

export const PROJECT_TYPES = ['products', 'opensource', 'clients', 'employers'] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

const ExperienceSchema = z.object({
  organization: z.string(),
  location: z.string(),
  roles: z.array(z.object({ title: z.string(), period: z.string() })).min(1),
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  engagements: z
    .array(z.object({ name: z.string(), period: z.string(), highlights: z.array(z.string()) }))
    .optional(),
});

export const ProfileSchema = z.object({
  personal: z.object({
    name: z.string(),
    title: z.string(),
    headline: z.string(),
    avatarPath: z.string().startsWith('/'),
    location: z.string(),
    workPreference: z.string(),
    summary: z.string(),
    story: z.string(),
  }),
  contact: z.object({
    email: z.email(),
    linkedin: httpsUrl,
    github: httpsUrl,
    site: httpsUrl,
  }),
  experience: z.array(ExperienceSchema).min(1),
  productsNote: z.string(),
  skills: z.array(z.object({ category: z.string(), items: z.array(z.string()).min(1) })).min(1),
  education: z.array(z.object({ institution: z.string(), detail: z.string() })),
  projects: z.record(z.enum(PROJECT_TYPES), z.record(z.string(), ProjectSchema)),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;

const SideSchema = z.object({ label: z.string(), points: z.array(z.string()).min(1) });

export const CaseStudySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  kind: z.enum(['product', 'client', 'employer', 'opensource']),
  title: z.string(),
  tagline: z.string(),
  organization: z.string(),
  role: z.string(),
  period: z.string(),
  links: z.object({ live: httpsUrl.optional(), github: httpsUrl.optional() }).default({}),
  context: z.string(),
  delivered: z.array(z.string()).min(1),
  stack: z.array(z.string()).min(1),
  problem: z.object({ before: SideSchema, after: SideSchema }).optional(),
  results: z.array(z.string()).optional(),
  /** Files from this repository to browse in the Code tab, as paths from the repository root. */
  source: z.array(z.string().regex(/^(src|content)\/[\w./-]+$/)).optional(),
});

export type CaseStudy = z.infer<typeof CaseStudySchema>;

const AnswerSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  question: z.string(),
  topic: z.string(),
  /** Shown as a starter card on the empty conversation. */
  suggested: z.boolean().optional(),
  /** Words and phrases that point a typed question at this answer. */
  keywords: z.array(z.string()).min(1),
  answer: z.string(),
  followUps: z.array(z.string()).default([]),
});

/** ARLO's prepared answers, written in advance from Zachariah's records. */
export const AnswerSetSchema = z.object({
  answers: z.array(AnswerSchema).min(1),
  fallback: z.string(),
});

export type Answer = z.infer<typeof AnswerSchema>;
export type AnswerSet = z.infer<typeof AnswerSetSchema>;
