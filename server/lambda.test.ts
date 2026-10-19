import type { LambdaFunctionURLEvent } from 'aws-lambda';
import { describe, expect, it } from 'vitest';
import { toRequest, toResult } from './lambda.ts';

const event = (overrides: Partial<LambdaFunctionURLEvent> = {}): LambdaFunctionURLEvent =>
  ({
    version: '2.0',
    routeKey: '$default',
    rawPath: '/api/chat',
    rawQueryString: 'a=1',
    headers: { 'content-type': 'application/json' },
    requestContext: { domainName: 'abc.lambda-url.us-east-1.on.aws', http: { method: 'POST' } },
    body: '{"hello":"world"}',
    isBase64Encoded: false,
    ...overrides,
  }) as LambdaFunctionURLEvent;

describe('toRequest', () => {
  it('rebuilds URL, method, headers and body', async () => {
    const request = toRequest(event());
    expect(request.url).toBe('https://abc.lambda-url.us-east-1.on.aws/api/chat?a=1');
    expect(request.method).toBe('POST');
    expect(request.headers.get('content-type')).toBe('application/json');
    expect(await request.text()).toBe('{"hello":"world"}');
  });

  it('decodes a base64 body', async () => {
    const request = toRequest(
      event({ body: Buffer.from('{"x":1}').toString('base64'), isBase64Encoded: true }),
    );
    expect(await request.text()).toBe('{"x":1}');
  });
});

describe('toResult', () => {
  it('carries status, headers and body', async () => {
    const result = await toResult(Response.json({ ok: true }, { status: 201 }));
    expect(result).toMatchObject({ statusCode: 201, body: '{"ok":true}', isBase64Encoded: false });
    expect(result.headers?.['content-type']).toContain('application/json');
  });
});
