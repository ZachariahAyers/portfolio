import { describe, expect, it } from 'vitest';
import { ContactRequestSchema } from './contact.ts';

const valid = { name: 'Ada Lovelace', email: 'ada@example.com', message: 'Hello' };

describe('ContactRequestSchema', () => {
  it('accepts a complete message', () => {
    expect(ContactRequestSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ['an invalid email', { ...valid, email: 'not-an-email' }, 'Please enter a valid email address'],
    ['a blank name', { ...valid, name: '   ' }, 'Please enter your name'],
    ['an empty message', { ...valid, message: '' }, 'Please enter a message'],
  ])('rejects %s with a readable message', (_label, input, message) => {
    const result = ContactRequestSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(message);
  });

  it('caps the message length', () => {
    expect(ContactRequestSchema.safeParse({ ...valid, message: 'x'.repeat(5001) }).success).toBe(
      false,
    );
  });
});
