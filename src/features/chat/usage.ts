import { z } from 'zod';
import { readStored, writeStored } from '../../lib/storage.ts';

/**
 * Per-browser chat allowance. This is a courtesy limit shown to the visitor;
 * request volume is capped on the server side.
 */
export const DAILY_LIMIT = 50;
export const COOLDOWN_MS = 3000;

const UsageSchema = z.object({
  date: z.string(),
  count: z.number().int().nonnegative(),
  lastMessageAt: z.number(),
});

export type Usage = z.infer<typeof UsageSchema>;

export type SendCheck =
  | { ok: true }
  | { ok: false; reason: 'daily-limit' }
  | { ok: false; reason: 'cooldown'; waitSeconds: number };

const STORAGE_KEY = 'portfolio.chat-usage';

/** Returns today's usage, starting fresh when the stored record is from another day. */
export function usageFor(now: Date, stored: Usage | null): Usage {
  const date = now.toDateString();
  return stored?.date === date ? stored : { date, count: 0, lastMessageAt: 0 };
}

export function checkSend(usage: Usage, now: Date): SendCheck {
  if (usage.count >= DAILY_LIMIT) return { ok: false, reason: 'daily-limit' };
  const elapsed = now.getTime() - usage.lastMessageAt;
  if (elapsed < COOLDOWN_MS) {
    return {
      ok: false,
      reason: 'cooldown',
      waitSeconds: Math.ceil((COOLDOWN_MS - elapsed) / 1000),
    };
  }
  return { ok: true };
}

export function recordSend(usage: Usage, now: Date): Usage {
  return { ...usage, count: usage.count + 1, lastMessageAt: now.getTime() };
}

export const loadUsage = (now: Date = new Date()): Usage =>
  usageFor(now, readStored(STORAGE_KEY, UsageSchema.nullable(), null));

export const saveUsage = (usage: Usage): void => writeStored(STORAGE_KEY, usage);
