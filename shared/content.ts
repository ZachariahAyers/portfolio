import { z } from 'zod';

/**
 * Schemas for the authored content in content/. They cover the fields the site
 * renders; other authored fields are kept in the files and stripped on parse.
 */

const httpsUrl = z.url({ protocol: /^https$/ });

// Profile

const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  technologies: z.array(z.string()).default([]),
  image: z.string().startsWith('/'),
  impact: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  current: z.boolean().optional(),
  url: httpsUrl.optional(),
  github: httpsUrl.optional(),
  caseStudy: z
    .string()
    .regex(/^\/casestudies\/[a-z0-9-]+$/)
    .optional(),
});

export const PROJECT_TYPES = ['opensource', 'enterprise', 'freelance', 'leadership'] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const SKILL_LEVELS = ['expert', 'proficient', 'familiar'] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

const SkillLevelSchema = z
  .object({ description: z.string() })
  .catchall(z.union([z.string(), z.array(z.string())]));

export const ProfileSchema = z.object({
  personal: z.object({
    name: z.string(),
    title: z.string(),
    avatarPath: z.string().startsWith('/'),
    tagline: z.string(),
    executiveSummary: z.array(z.string()).min(1),
    valueProposition: z.string(),
    whatIBring: z.array(z.string()).min(1),
  }),
  contact: z.object({
    email: z.email(),
    linkedin: httpsUrl,
    github: httpsUrl,
    portfolio: httpsUrl,
    assemblejs: httpsUrl,
  }),
  skills: z.record(z.enum(SKILL_LEVELS), SkillLevelSchema),
  projects: z.record(z.enum(PROJECT_TYPES), z.record(z.string(), ProjectSchema)),
  certifications: z.record(z.string(), z.array(z.string())),
  certificationDetails: z.record(
    z.string(),
    z.object({
      credentialId: z.string().nullable(),
      verifyUrl: httpsUrl.nullable(),
      inProgress: z.boolean(),
    }),
  ),
  interviewQuestions: z.record(z.string(), z.array(z.string())),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type Project = z.infer<typeof ProjectSchema>;

// Case studies

const ProblemSectionSchema = z.object({
  id: z.literal('problem'),
  title: z.string(),
  before: z.object({ label: z.string(), points: z.array(z.string()) }),
  after: z.object({ label: z.string(), points: z.array(z.string()) }),
});

const ResultsSectionSchema = z.object({
  id: z.literal('results'),
  title: z.string(),
  executive_summary: z.string().optional(),
  sections: z
    .array(
      z.object({
        title: z.string(),
        highlights: z.array(z.string()).optional(),
        metrics: z
          .array(
            z.object({
              metric: z.string(),
              before: z.string(),
              after: z.string(),
              change: z.string(),
            }),
          )
          .optional(),
        summary: z.string().optional(),
      }),
    )
    .default([]),
});

const CodeSampleSchema = z.union([
  z.string(),
  z.object({
    name: z.string(),
    tech: z.string(),
    code: z.string(),
    docUrl: httpsUrl.optional(),
  }),
]);

const AttachmentSchema = z
  .object({
    title: z.string().optional(),
    name: z.string().optional(),
    type: z.string().optional(),
    size: z.string().optional(),
    description: z.string().optional(),
  })
  .transform(({ title, name, ...rest }) => ({ ...rest, label: title ?? name ?? 'Attachment' }));

export const CaseStudySchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    category: z.string(),
    hero: z.object({ title: z.string(), tagline: z.string(), badge: z.string() }),
    timeline: z.object({ duration: z.string(), role: z.string(), year: z.string() }),
    links: z.object({
      demo: httpsUrl.optional(),
      live: httpsUrl.optional(),
      github: httpsUrl.optional(),
      githubApi: httpsUrl.optional(),
      documentation: httpsUrl.optional(),
      linkedin: httpsUrl.optional(),
    }),
    businessRequirements: z.object({
      jiraPrefix: z.string(),
      businessContext: z.string(),
      problemStatement: z.string(),
      businessValue: z.array(z.string()),
      acceptanceCriteria: z.array(z.string()),
      attachments: z.array(AttachmentSchema).default([]),
    }),
    activity: z.array(
      z.object({ author: z.string(), avatar: z.string(), comment: z.string(), time: z.string() }),
    ),
    sections: z.array(z.looseObject({ id: z.string().optional() })),
    techStackAnalyzer: z.object({
      projectName: z.string(),
      fileStructure: z.record(z.string(), z.array(CodeSampleSchema)),
    }),
  })
  .transform(({ sections, ...rest }, ctx) => {
    const problem = ProblemSectionSchema.safeParse(sections.find((s) => s.id === 'problem'));
    const results = ResultsSectionSchema.safeParse(sections.find((s) => s.id === 'results'));
    if (!problem.success || !results.success) {
      ctx.addIssue({ code: 'custom', message: 'needs a valid problem and results section' });
      return z.NEVER;
    }
    return { ...rest, problem: problem.data, results: results.data };
  });

export type CaseStudy = z.infer<typeof CaseStudySchema>;
export type CodeSample = z.infer<typeof CodeSampleSchema>;

/** The deployed site of a case study, when one exists. Source links are not deployments. */
export function liveUrl(caseStudy: Pick<CaseStudy, 'links'>): string | undefined {
  return caseStudy.links.demo ?? caseStudy.links.live;
}
