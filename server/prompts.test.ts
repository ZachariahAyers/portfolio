import { describe, expect, it } from 'vitest';
import { profile, profileJson } from '../shared/profile.ts';
import { chatSystemPrompt, strengthsSystemPrompt, summarySystemPrompt } from './prompts.ts';

describe('chatSystemPrompt', () => {
  const prompt = chatSystemPrompt(profileJson);

  it('quotes the profile as the only source of facts', () => {
    expect(prompt).toContain('<AUTHORIZED_DATA>');
    expect(prompt).toContain(profile.personal.name);
  });

  it('tells the assistant to be honest that it is an AI when asked', () => {
    expect(prompt).toMatch(/say plainly that you are ARLO, an AI assistant/);
    expect(prompt).not.toMatch(/NEVER acknowledge being AI/);
  });

  it('limits what it says about Northrop Grumman to the public profile wording', () => {
    expect(prompt).toMatch(/About Northrop Grumman, say only what AUTHORIZED_DATA/);
    expect(prompt).not.toMatch(/predictive maintenance|air-gapped|\$300K/i);
  });
});

describe('personalisation prompts', () => {
  it('include what the visitor looked at, or say they just arrived', () => {
    expect(summarySystemPrompt(profile, ['viewed projects'])).toContain('"viewed projects"');
    expect(strengthsSystemPrompt(profile, [])).toContain("hasn't asked any questions yet");
  });
});
