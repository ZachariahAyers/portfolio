import { answerSet } from '../../content/profile.ts';
import type { Answer } from '../../content/schema.ts';

export const { answers: ANSWERS, fallback: FALLBACK } = answerSet;

/** Starter questions on the empty conversation. */
export const SUGGESTED = ANSWERS.filter((answer) => answer.suggested);

/** How many suggestions fit on a phone screen. */
export const MOBILE_SUGGESTION_COUNT = 2;

/** The question that opens the contact details. */
export const CONTACT_QUESTION = ANSWERS.find((answer) => answer.id === 'contact')?.question ?? '';

const byId = new Map(ANSWERS.map((answer) => [answer.id, answer]));

/** Questions to offer after an answer, or the starter questions after the fallback. */
export function followUpsFor(answer: Answer | null): string[] {
  const next = answer ? answer.followUps.flatMap((id) => byId.get(id) ?? []) : SUGGESTED;
  return next.map((a) => a.question);
}

/** The "Quick Questions" panel: every prepared question, grouped by topic. */
export const QUESTIONS_BY_TOPIC = new Map<string, Answer[]>();
for (const answer of ANSWERS) {
  QUESTIONS_BY_TOPIC.set(answer.topic, [...(QUESTIONS_BY_TOPIC.get(answer.topic) ?? []), answer]);
}
