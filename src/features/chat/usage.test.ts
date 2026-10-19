import { describe, expect, it } from 'vitest';
import { checkSend, COOLDOWN_MS, DAILY_LIMIT, recordSend, usageFor } from './usage.ts';

const noon = new Date('2026-10-19T12:00:00');

describe('chat usage', () => {
  it('starts each day fresh', () => {
    const yesterday = {
      date: new Date('2026-10-18T12:00:00').toDateString(),
      count: 49,
      lastMessageAt: 1,
    };
    expect(usageFor(noon, yesterday)).toEqual({
      date: noon.toDateString(),
      count: 0,
      lastMessageAt: 0,
    });
  });

  it('keeps today’s count', () => {
    const today = { date: noon.toDateString(), count: 3, lastMessageAt: 5 };
    expect(usageFor(noon, today)).toBe(today);
  });

  it('allows a message after the cooldown and records it', () => {
    const usage = usageFor(noon, null);
    expect(checkSend(usage, noon)).toEqual({ ok: true });
    expect(recordSend(usage, noon)).toMatchObject({ count: 1, lastMessageAt: noon.getTime() });
  });

  it('asks the visitor to wait during the cooldown, in whole seconds', () => {
    const usage = { date: noon.toDateString(), count: 1, lastMessageAt: noon.getTime() - 500 };
    expect(checkSend(usage, noon)).toEqual({
      ok: false,
      reason: 'cooldown',
      waitSeconds: Math.ceil((COOLDOWN_MS - 500) / 1000),
    });
  });

  it('stops at the daily limit', () => {
    const usage = { date: noon.toDateString(), count: DAILY_LIMIT, lastMessageAt: 0 };
    expect(checkSend(usage, noon)).toEqual({ ok: false, reason: 'daily-limit' });
  });
});
