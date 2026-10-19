import { describe, expect, it } from 'vitest';
import { followUpsFor, SUGGESTED_QUESTIONS } from './questions.ts';

describe('follow-up questions', () => {
  it('has tailored follow-ups for every suggested question', () => {
    for (const question of SUGGESTED_QUESTIONS) {
      expect(followUpsFor(question)).not.toEqual(followUpsFor(null));
    }
  });

  it('falls back to generic follow-ups', () => {
    expect(followUpsFor('Something nobody planned for')).toContain('Can you elaborate on that?');
  });
});
