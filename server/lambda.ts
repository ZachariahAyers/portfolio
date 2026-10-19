import type { APIGatewayProxyStructuredResultV2, LambdaFunctionURLEvent } from 'aws-lambda';
import { type ApiDeps, handleApiRequest } from './api.ts';
import { readEnv } from './env.ts';

/** Converts a Lambda function URL event (payload format 2.0) into a Fetch API Request. */
export function toRequest(event: LambdaFunctionURLEvent): Request {
  const query = event.rawQueryString ? `?${event.rawQueryString}` : '';
  const headers = new Headers();
  for (const [name, value] of Object.entries(event.headers)) {
    if (value !== undefined) headers.set(name, value);
  }
  const method = event.requestContext.http.method;
  const hasBody = event.body !== undefined && method !== 'GET' && method !== 'HEAD';
  return new Request(`https://${event.requestContext.domainName}${event.rawPath}${query}`, {
    method,
    headers,
    ...(hasBody && {
      body: event.isBase64Encoded ? Buffer.from(event.body ?? '', 'base64') : event.body,
    }),
  });
}

/** Function URLs use the API Gateway v2 response shape. */
export async function toResult(response: Response): Promise<APIGatewayProxyStructuredResultV2> {
  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers),
    body: await response.text(),
    isBase64Encoded: false,
  };
}

const deps: ApiDeps = {
  env: readEnv(process.env),
  fetch: globalThis.fetch,
  log: (entry) => console.error(JSON.stringify(entry)),
};

export async function handler(
  event: LambdaFunctionURLEvent,
): Promise<APIGatewayProxyStructuredResultV2> {
  return toResult(await handleApiRequest(toRequest(event), deps));
}
