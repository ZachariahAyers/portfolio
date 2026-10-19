import { type ChatMessage, ChatReplySchema, StrengthsReplySchema } from '../../../shared/chat.ts';
import { ApiError, postJson } from '../../lib/api.ts';

export async function askAssistant(messages: ChatMessage[]): Promise<string> {
  try {
    const reply = await postJson('/api/chat', { mode: 'chat', messages }, ChatReplySchema);
    return reply.text;
  } catch (error) {
    if (error instanceof ApiError && error.status === 429) {
      return "I've hit my usage limit for now. Please try again in a few minutes or contact Zach directly using the contact form.";
    }
    return "I'm having trouble connecting right now. Please try again later or contact Zach directly.";
  }
}

export async function fetchSummary(interests: string[]): Promise<string> {
  const reply = await postJson('/api/chat', { mode: 'summary', interests }, ChatReplySchema);
  return reply.text;
}

export async function fetchStrengths(interests: string[]): Promise<string[]> {
  const reply = await postJson('/api/chat', { mode: 'strengths', interests }, StrengthsReplySchema);
  return reply.bullets;
}
