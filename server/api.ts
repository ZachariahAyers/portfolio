import {
  type ChatRequest,
  ChatRequestSchema,
  screenQuestion,
  StrengthsReplySchema,
} from '../shared/chat.ts';
import { ContactRequestSchema } from '../shared/contact.ts';
import { ErrorReportSchema } from '../shared/error-report.ts';
import { profile, profileJson } from '../shared/profile.ts';
import type { ApiEnv } from './env.ts';
import { generate, type GeminiConfig, UpstreamError } from './gemini.ts';
import { sendContactEmail } from './mail.ts';
import {
  chatSystemPrompt,
  STRENGTHS_JSON_SCHEMA,
  strengthsSystemPrompt,
  summarySystemPrompt,
} from './prompts.ts';

export interface ApiDeps {
  env: ApiEnv;
  fetch: typeof fetch;
  log: (entry: Record<string, unknown>) => void;
}

const MAX_BODY_BYTES = 64 * 1024;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

const fail = (status: number, error: string) => json(status, { error });

class BadRequest extends Error {}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

async function readJson(request: Request): Promise<unknown> {
  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) throw new BadRequest('too large');
  const body = parseJson(text);
  if (body === undefined) throw new BadRequest('invalid json');
  return body;
}

function gemini(deps: ApiDeps): GeminiConfig | undefined {
  const { geminiApiKey, geminiModel } = deps.env;
  return geminiApiKey ? { apiKey: geminiApiKey, model: geminiModel, fetch: deps.fetch } : undefined;
}

/** Drops visitor-supplied interest strings the question screen would reject. */
const cleanInterests = (interests: string[]) =>
  interests.filter((interest) => screenQuestion(interest).ok);

async function chat(body: ChatRequest, config: GeminiConfig): Promise<Response> {
  switch (body.mode) {
    case 'chat': {
      const last = body.messages.at(-1);
      if (last?.role !== 'user') return fail(400, 'The last message must be from the visitor');
      const screen = screenQuestion(last.text);
      if (!screen.ok) return json(200, { text: screen.reply });
      const text = await generate(config, {
        system: chatSystemPrompt(profileJson),
        turns: body.messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          text: m.text,
        })),
        maxOutputTokens: 1000,
        temperature: 0.7,
      });
      return json(200, { text });
    }
    case 'summary': {
      const text = await generate(config, {
        system: summarySystemPrompt(profile, cleanInterests(body.interests)),
        turns: [{ role: 'user', text: 'Write the executive summary.' }],
        maxOutputTokens: 200,
        temperature: 0.7,
      });
      return json(200, { text });
    }
    case 'strengths': {
      const raw = await generate(config, {
        system: strengthsSystemPrompt(profile, cleanInterests(body.interests)),
        turns: [{ role: 'user', text: 'Write the list.' }],
        maxOutputTokens: 600,
        temperature: 0.7,
        jsonSchema: STRENGTHS_JSON_SCHEMA,
      });
      const parsed = StrengthsReplySchema.safeParse(parseJson(raw));
      if (!parsed.success) throw new UpstreamError(502, 'Gemini returned an unexpected shape');
      return json(200, { bullets: parsed.data.bullets.slice(0, 7) });
    }
  }
}

async function route(request: Request, deps: ApiDeps): Promise<Response> {
  const { pathname } = new URL(request.url);
  const routes = ['/api/chat', '/api/contact', '/api/errors'];
  if (!routes.includes(pathname)) return fail(404, 'Not found');
  if (request.method !== 'POST') return fail(405, 'Use POST');

  const body = await readJson(request);

  if (pathname === '/api/chat') {
    const parsed = ChatRequestSchema.safeParse(body);
    if (!parsed.success) return fail(400, 'Invalid chat request');
    const config = gemini(deps);
    if (!config) return fail(503, 'Chat is not configured');
    return chat(parsed.data, config);
  }

  if (pathname === '/api/contact') {
    const parsed = ContactRequestSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? 'Invalid message');
    if (parsed.data.website) return json(200, { ok: true });
    const { resendApiKey, contactFrom, contactTo } = deps.env;
    if (!resendApiKey || !contactFrom || !contactTo) return fail(503, 'Contact is not configured');
    await sendContactEmail(
      { apiKey: resendApiKey, from: contactFrom, to: contactTo, fetch: deps.fetch },
      parsed.data,
    );
    return json(200, { ok: true });
  }

  const parsed = ErrorReportSchema.safeParse(body);
  if (!parsed.success) return fail(400, 'Invalid error report');
  deps.log({ event: 'client-error', ...parsed.data });
  return new Response(null, { status: 204 });
}

/** Handles every /api request. Platform adapters (Lambda, the dev server) translate to and from this. */
export async function handleApiRequest(request: Request, deps: ApiDeps): Promise<Response> {
  try {
    return await route(request, deps);
  } catch (error) {
    if (error instanceof BadRequest)
      return fail(error.message === 'too large' ? 413 : 400, error.message);
    if (error instanceof UpstreamError) {
      deps.log({ event: 'upstream-error', status: error.status, message: error.message });
      return fail(
        error.status === 429 ? 429 : 502,
        'The service is busy. Please try again shortly.',
      );
    }
    deps.log({ event: 'unhandled-error', message: String(error) });
    return fail(500, 'Something went wrong');
  }
}
