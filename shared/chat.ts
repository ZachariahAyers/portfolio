import { z } from 'zod';

export const CHAT_LIMITS = {
  /** Longest question a visitor may send. */
  maxMessageLength: 500,
  /** Messages of history forwarded to the model, oldest dropped first. */
  maxHistory: 10,
  /** Recent questions and viewed sections used to personalise the profile view. */
  maxInterests: 20,
  maxInterestLength: 200,
} as const;

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string().min(1).max(4000),
});

export const ChatRequestSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('chat'),
    messages: z.array(ChatMessageSchema).min(1).max(CHAT_LIMITS.maxHistory),
  }),
  z.object({
    mode: z.enum(['summary', 'strengths']),
    interests: z.array(z.string().max(CHAT_LIMITS.maxInterestLength)).max(CHAT_LIMITS.maxInterests),
  }),
]);

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const ChatReplySchema = z.object({ text: z.string() });
export const StrengthsReplySchema = z.object({ bullets: z.array(z.string()).min(1) });

export type ChatReply = z.infer<typeof ChatReplySchema>;
export type StrengthsReply = z.infer<typeof StrengthsReplySchema>;

/** The assistant writes this marker when the visitor asks how to get in touch. */
export const CONTACT_FORM_MARKER = '[OPEN_CONTACT_FORM]';

const INJECTION_PATTERNS = [
  /system\s*:/i,
  /assistant\s*:/i,
  /\[.*INST.*\]/i,
  /ignore.*previous/i,
  /forget.*instructions/i,
  /you.*are.*now/i,
  /new.*instructions/i,
];

export type ScreenResult = { ok: true } | { ok: false; reply: string };

/**
 * Screens a visitor's question before it reaches the model. The server applies
 * the same check, so a modified client cannot skip it.
 */
export function screenQuestion(text: string): ScreenResult {
  if (text.length > CHAT_LIMITS.maxMessageLength) {
    return {
      ok: false,
      reply:
        "That's a pretty long question! Mind breaking it down into something more specific about my experience?",
    };
  }
  if (INJECTION_PATTERNS.some((pattern) => pattern.test(text))) {
    return {
      ok: false,
      reply:
        "Let's keep the conversation focused on my professional experience. What would you like to know about my background?",
    };
  }
  return { ok: true };
}
