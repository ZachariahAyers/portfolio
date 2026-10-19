export interface Step {
  /** Characters of the text to show after this step. */
  end: number;
  /** Milliseconds to wait before the next step. */
  delay: number;
}

export type Pacing = (text: string, shown: number) => Step;

/**
 * Reads like someone typing: short words arrive together and punctuation and
 * line breaks get a pause.
 */
export const conversationalPacing: Pacing = (text, shown) => {
  const previous = text[shown - 1] ?? '';
  const current = text[shown] ?? '';
  const next = text[shown + 1] ?? '';

  if (/[.!?]/.test(previous)) return { end: shown + 1, delay: 200 };
  if (/[,;:]/.test(previous)) return { end: shown + 1, delay: 100 };
  if (previous === '\n' || (previous === ' ' && next === '\n'))
    return { end: shown + 1, delay: 150 };
  if (current === ' ') {
    const word = /^\s*\S{1,4}(?=\s|$)/.exec(text.slice(shown));
    return { end: shown + (word ? Math.min(word[0].length, 3) : 1), delay: 10 };
  }
  return { end: shown + 1, delay: 15 };
};

/** One character every few milliseconds. */
export const steadyPacing: Pacing = (_text, shown) => ({ end: shown + 1, delay: 8 });
