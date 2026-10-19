import type { IncomingMessage, ServerResponse } from 'node:http';
import { loadEnv, type Plugin } from 'vite';
import type * as Api from './api.ts';
import type * as Env from './env.ts';

async function toRequest(req: IncomingMessage): Promise<Request> {
  const chunks: Buffer[] = [];
  for await (const chunk of req)
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') headers.set(name, value);
    else if (Array.isArray(value)) for (const v of value) headers.append(name, v);
  }
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  return new Request(`http://localhost${req.url ?? '/'}`, {
    method: req.method ?? 'GET',
    headers,
    ...(hasBody && { body: Buffer.concat(chunks) }),
  });
}

async function send(res: ServerResponse, response: Response): Promise<void> {
  res.statusCode = response.status;
  response.headers.forEach((value, name) => res.setHeader(name, value));
  res.end(Buffer.from(await response.arrayBuffer()));
}

const isApi = (module: Record<string, unknown>): module is typeof Api =>
  typeof module['handleApiRequest'] === 'function';
const isEnv = (module: Record<string, unknown>): module is typeof Env =>
  typeof module['readEnv'] === 'function';

/**
 * Serves /api/* from server/api.ts during `vite dev`, reading keys from .env.
 * Production runs the same handler through server/lambda.ts.
 */
export function devApi(): Plugin {
  return {
    name: 'portfolio-dev-api',
    apply: 'serve',
    configureServer(server) {
      const source = loadEnv(server.config.mode, server.config.root, '');
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();
        void (async () => {
          const api = await server.ssrLoadModule('/server/api.ts');
          const env = await server.ssrLoadModule('/server/env.ts');
          if (!isApi(api) || !isEnv(env))
            throw new Error('server/api.ts or server/env.ts changed shape');
          const response = await api.handleApiRequest(await toRequest(req), {
            env: env.readEnv(source),
            fetch: globalThis.fetch,
            log: (entry) => server.config.logger.warn(JSON.stringify(entry)),
          });
          await send(res, response);
        })().catch(next);
      });
    },
  };
}
