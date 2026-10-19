import type { z } from 'zod';

/**
 * localStorage that never throws and never trusts what it reads: private
 * windows, blocked storage and stale or edited values all give the fallback.
 */
export function readStored<S extends z.ZodType>(
  key: string,
  schema: S,
  fallback: z.infer<S>,
): z.infer<S> {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : fallback;
  } catch {
    return fallback;
  }
}

export function writeStored(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable; the value lives for this page view only.
  }
}
