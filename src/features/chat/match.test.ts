import { describe, expect, it } from 'vitest';
import { answerSet } from '../../content/profile.ts';
import { matchAnswer } from './match.ts';

const { answers } = answerSet;
const idFor = (question: string) => matchAnswer(question, answers)?.id ?? null;

describe('matchAnswer', () => {
  it('answers every prepared question with its own answer', () => {
    for (const answer of answers) expect(idFor(answer.question)).toBe(answer.id);
  });

  it('ignores case, punctuation and spacing on an exact question', () => {
    expect(idFor('  what does ZACH do  ')).toBe('overview');
  });

  it.each([
    ['How do I reach him?', 'contact'],
    ['Tell me about Northrop', 'northrop'],
    ["what's magpie", 'magpie'],
    ['Tell me about the products', 'products'],
    ['Is this ChatGPT?', 'about-arlo'],
    ['What AI work did he do at Northrop Grumman?', 'northrop'],
    ['Does he use Claude Code?', 'ai'],
    ['Which C# frameworks?', 'languages'],
    ['How did the VB6 port to .NET go?', 'northrop'],
    ['Is Zach open to remote work?', 'availability'],
    ['Tell me about the underwriting rewrite', 'aussie'],
    ['Walmart AutoCAD plug-ins', 'cad'],
  ])('matches "%s" to %s', (question, id) => {
    expect(idFor(question)).toBe(id);
  });

  it('finds nothing for a question no keyword covers', () => {
    expect(idFor('qwerty asdf')).toBeNull();
    expect(idFor('   ')).toBeNull();
  });

  it('needs a whole word, not part of one', () => {
    expect(idFor('aussies')).toBe('aussie');
    expect(idFor('caddie')).toBeNull();
  });
});

describe('answer set', () => {
  const ids = new Set(answers.map((answer) => answer.id));

  it('has unique ids and follow-ups that point at real answers', () => {
    expect(ids.size).toBe(answers.length);
    for (const answer of answers) {
      for (const followUp of answer.followUps) expect(ids).toContain(followUp);
    }
  });

  it('suggests a handful of starter questions', () => {
    expect(answers.filter((answer) => answer.suggested).length).toBeGreaterThanOrEqual(4);
  });

  it('never claims a live model or generated text', () => {
    const text = JSON.stringify(answerSet);
    expect(text).not.toMatch(
      /real[- ]time (answer|ai|chat|generation)|generated (for you|live)|powered by|Gemini|GPT-\d|large language model/i,
    );
  });
});
