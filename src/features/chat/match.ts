import type { Answer } from '../../content/schema.ts';

/** Lower case, accents and punctuation dropped; keeps the characters in C#, C++ and .NET. */
function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/['’]s\b/g, '')
    .replace(/[^a-z0-9+#./-]+/g, ' ')
    .split(' ')
    .map((word) => word.replace(/[./-]+$/, '').replace(/^[/-]+/, ''))
    .filter(Boolean)
    .map(stem);
}

/** Folds simple plurals so "products" finds "product". */
const stem = (word: string) =>
  word.length > 3 && word.endsWith('s') && !word.endsWith('ss') ? word.slice(0, -1) : word;

const phrase = (text: string) => ` ${tokens(text).join(' ')} `;

/**
 * The prepared answer closest to a typed question: an exact question wins,
 * otherwise the answer with the most keywords found in the question. A tie goes
 * to the answer listed first. Resolves null when no keyword matches.
 */
export function matchAnswer(question: string, answers: readonly Answer[]): Answer | null {
  const asked = phrase(question);
  if (asked.trim() === '') return null;
  const exact = answers.find((answer) => phrase(answer.question) === asked);
  if (exact) return exact;

  let best: Answer | null = null;
  let bestScore = 0;
  for (const answer of answers) {
    const score = answer.keywords.filter((keyword) => asked.includes(phrase(keyword))).length;
    if (score > bestScore) {
      best = answer;
      bestScore = score;
    }
  }
  return best;
}
