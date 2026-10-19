import { z } from 'zod';

const ReplySchema = z.object({
  candidates: z
    .array(
      z.object({
        content: z
          .object({ parts: z.array(z.object({ text: z.string().optional() })).optional() })
          .optional(),
      }),
    )
    .optional(),
});

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const TIMEOUT_MS = 25_000;

export interface GeminiTurn {
  role: 'user' | 'model';
  text: string;
}

export interface GenerateRequest {
  system: string;
  turns: GeminiTurn[];
  maxOutputTokens: number;
  temperature: number;
  /** JSON Schema for a JSON reply. Omit for plain text. */
  jsonSchema?: Record<string, unknown>;
}

export interface GeminiConfig {
  apiKey: string;
  model: string;
  fetch: typeof fetch;
}

/** A failed call to an upstream service, carrying the status the API should answer with. */
export class UpstreamError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'UpstreamError';
    this.status = status;
  }
}

/** Calls Gemini generateContent and returns the reply text. */
export async function generate(config: GeminiConfig, request: GenerateRequest): Promise<string> {
  const response = await config.fetch(
    `${API_BASE}/${encodeURIComponent(config.model)}:generateContent`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': config.apiKey },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: request.system }] },
        contents: request.turns.map((turn) => ({ role: turn.role, parts: [{ text: turn.text }] })),
        generationConfig: {
          maxOutputTokens: request.maxOutputTokens,
          temperature: request.temperature,
          ...(request.jsonSchema && {
            responseMimeType: 'application/json',
            responseJsonSchema: request.jsonSchema,
          }),
        },
      }),
    },
  );

  if (response.status === 429) throw new UpstreamError(429, 'Gemini rate limit reached');
  if (!response.ok) throw new UpstreamError(502, `Gemini answered ${response.status}`);

  const body = ReplySchema.safeParse(await response.json());
  if (!body.success) throw new UpstreamError(502, 'Gemini returned an unexpected shape');
  const text = body.data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('')
    .trim();
  if (!text) throw new UpstreamError(502, 'Gemini returned no text');
  return text;
}
