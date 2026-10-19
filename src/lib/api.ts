import type { z } from 'zod';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** POSTs JSON to the site's own /api and validates the reply against a schema. */
export async function postJson<S extends z.ZodType>(
  path: string,
  body: unknown,
  schema: S,
  timeoutMs = 30_000,
): Promise<z.infer<S>> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch {
    throw new ApiError(0, 'Network error');
  }
  const data: unknown = await response.json().catch(() => undefined);
  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
        ? data.error
        : `Request failed with ${response.status}`;
    throw new ApiError(response.status, message);
  }
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new ApiError(response.status, 'Unexpected response');
  return parsed.data;
}

/** Fire-and-forget POST for telemetry. Failures are ignored. */
export function beacon(path: string, body: unknown): void {
  void fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => undefined);
}
