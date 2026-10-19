import { describe, expect, it } from 'vitest';
import { conversationalPacing, steadyPacing } from './pacing.ts';

describe('conversationalPacing', () => {
  it('pauses longest after the end of a sentence', () => {
    expect(conversationalPacing('Done. Next', 5)).toEqual({ end: 6, delay: 200 });
  });

  it('pauses after a comma', () => {
    expect(conversationalPacing('Yes, sure', 4)).toEqual({ end: 5, delay: 100 });
  });

  it('pauses at a line break', () => {
    expect(conversationalPacing('a\nb', 2).delay).toBe(150);
  });

  it('moves through short words a few characters at a time', () => {
    expect(conversationalPacing('so I do it', 2)).toEqual({ end: 4, delay: 10 });
  });

  it('types one character at the base rate otherwise', () => {
    expect(conversationalPacing('hello', 1)).toEqual({ end: 2, delay: 15 });
  });

  it('always moves forward, so typing ends', () => {
    const text = 'Hello, world. This is a test of the pacing!\nNew line.';
    let shown = 0;
    let steps = 0;
    while (shown < text.length && steps < 1000) {
      const next = conversationalPacing(text, shown).end;
      expect(next).toBeGreaterThan(shown);
      shown = next;
      steps++;
    }
    expect(shown).toBeGreaterThanOrEqual(text.length);
  });
});

describe('steadyPacing', () => {
  it('adds one character every 8ms', () => {
    expect(steadyPacing('abc', 1)).toEqual({ end: 2, delay: 8 });
  });
});
