import { z } from 'zod';

/**
 * PageSpeed Insights, called from the browser. The API works without a key at a
 * low anonymous quota; VITE_PAGESPEED_API_KEY raises it.
 */

const ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'] as const;
const CACHE_KEY = 'portfolio.pagespeed';
const CACHE_MS = 30 * 60 * 1000;

const AuditSchema = z.object({
  title: z.string().optional(),
  score: z.number().nullable().optional(),
  displayValue: z.string().optional(),
  details: z
    .object({ type: z.string().optional(), overallSavingsMs: z.number().optional() })
    .optional(),
});
type Audit = z.infer<typeof AuditSchema>;

const RawResultSchema = z.object({
  lighthouseResult: z
    .object({
      lighthouseVersion: z.string().optional(),
      categories: z
        .record(z.string(), z.object({ score: z.number().nullable().optional() }))
        .optional(),
      audits: z.record(z.string(), AuditSchema).optional(),
    })
    .optional(),
  loadingExperience: z
    .object({
      metrics: z.record(z.string(), z.object({ percentile: z.number().optional() })).optional(),
    })
    .optional(),
});
type RawResult = z.infer<typeof RawResultSchema>;

const VitalSchema = z.object({ score: z.number(), displayValue: z.string() });

const ReportSchema = z.object({
  lighthouseVersion: z.string(),
  scores: z.object({
    performance: z.number(),
    accessibility: z.number(),
    bestPractices: z.number(),
    seo: z.number(),
  }),
  vitals: z.object({ lcp: VitalSchema, cls: VitalSchema, tbt: VitalSchema }),
  /** Real-user percentiles from the Chrome UX Report, when the page has enough traffic. */
  field: z
    .object({
      fcp: z.number().optional(),
      lcp: z.number().optional(),
      inp: z.number().optional(),
      cls: z.number().optional(),
    })
    .nullable(),
  opportunities: z.array(z.object({ title: z.string(), savings: z.string() })),
  diagnostics: z.array(z.object({ title: z.string(), displayValue: z.string().optional() })),
});

export type Vital = z.infer<typeof VitalSchema>;
export type PageSpeedReport = z.infer<typeof ReportSchema>;

const CacheSchema = z.record(z.string(), z.object({ savedAt: z.number(), report: ReportSchema }));
type Cache = z.infer<typeof CacheSchema>;

const percent = (score: number | null | undefined) => Math.round((score ?? 0) * 100);

function vital(audits: Record<string, Audit>, id: string): Vital {
  const audit = audits[id];
  return { score: audit?.score ?? 0, displayValue: audit?.displayValue ?? 'N/A' };
}

/** Reduces a raw PageSpeed response to what the Release tab shows. */
export function summarize(raw: RawResult): PageSpeedReport {
  const lighthouse = raw.lighthouseResult ?? {};
  const audits = lighthouse.audits ?? {};
  const metrics = raw.loadingExperience?.metrics;
  const field = metrics
    ? {
        ...(metrics.FIRST_CONTENTFUL_PAINT_MS?.percentile !== undefined && {
          fcp: metrics.FIRST_CONTENTFUL_PAINT_MS.percentile,
        }),
        ...(metrics.LARGEST_CONTENTFUL_PAINT_MS?.percentile !== undefined && {
          lcp: metrics.LARGEST_CONTENTFUL_PAINT_MS.percentile,
        }),
        ...(metrics.INTERACTION_TO_NEXT_PAINT?.percentile !== undefined && {
          inp: metrics.INTERACTION_TO_NEXT_PAINT.percentile,
        }),
        // CrUX reports layout shift multiplied by 100.
        ...(metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile !== undefined && {
          cls: metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100,
        }),
      }
    : null;

  const all = Object.values(audits);
  return {
    lighthouseVersion: lighthouse.lighthouseVersion ?? 'unknown',
    scores: {
      performance: percent(lighthouse.categories?.['performance']?.score),
      accessibility: percent(lighthouse.categories?.['accessibility']?.score),
      bestPractices: percent(lighthouse.categories?.['best-practices']?.score),
      seo: percent(lighthouse.categories?.['seo']?.score),
    },
    vitals: {
      lcp: vital(audits, 'largest-contentful-paint'),
      cls: vital(audits, 'cumulative-layout-shift'),
      tbt: vital(audits, 'total-blocking-time'),
    },
    field: field && Object.keys(field).length > 0 ? field : null,
    opportunities: all
      .filter((a) => a.details?.type === 'opportunity' && (a.details.overallSavingsMs ?? 0) > 0)
      .toSorted((a, b) => (b.details?.overallSavingsMs ?? 0) - (a.details?.overallSavingsMs ?? 0))
      .slice(0, 5)
      .map((a) => ({ title: a.title ?? 'Opportunity', savings: a.displayValue ?? '' })),
    diagnostics: all
      .filter(
        (a) =>
          a.details?.type === 'table' && a.score !== null && a.score !== undefined && a.score < 0.9,
      )
      .slice(0, 5)
      .map((a) => ({
        title: a.title ?? 'Diagnostic',
        ...(a.displayValue && { displayValue: a.displayValue }),
      })),
  };
}

export function requestUrl(pageUrl: string, apiKey?: string): string {
  const params = new URLSearchParams({ url: pageUrl, strategy: 'desktop' });
  for (const category of CATEGORIES) params.append('category', category);
  if (apiKey) params.set('key', apiKey);
  return `${ENDPOINT}?${params.toString()}`;
}

function readCache(): Cache {
  try {
    const parsed = CacheSchema.safeParse(JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? '{}'));
    return parsed.success ? parsed.data : {};
  } catch {
    return {};
  }
}

export function cachedReport(pageUrl: string, now = Date.now()): Cache[string] | undefined {
  const entry = readCache()[pageUrl];
  return entry && now - entry.savedAt < CACHE_MS ? entry : undefined;
}

export async function fetchReport(pageUrl: string): Promise<PageSpeedReport> {
  const response = await fetch(
    requestUrl(pageUrl, import.meta.env.VITE_PAGESPEED_API_KEY || undefined),
    {
      signal: AbortSignal.timeout(90_000),
    },
  );
  if (!response.ok) throw new Error(`PageSpeed answered ${response.status}`);
  const raw = RawResultSchema.safeParse(await response.json());
  if (!raw.success) throw new Error('PageSpeed returned an unexpected shape');
  const report = summarize(raw.data);
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ ...readCache(), [pageUrl]: { savedAt: Date.now(), report } }),
    );
  } catch {
    // Session storage unavailable; the report is not cached.
  }
  return report;
}
