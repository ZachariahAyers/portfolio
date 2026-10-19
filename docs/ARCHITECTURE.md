# Architecture

A single-page React app served as static files, plus a small API that runs as one AWS Lambda
function. The content lives in JSON and Mermaid files, apart from the code that renders it.

## Module map

| Path                         | Holds                                                                                                                                                                                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/`                   | Authored data: `profile.json`, `case-studies/*.json`, `diagrams/*.mmd`.                                                                                                                                                                              |
| `shared/`                    | Code both sides import: the API contract (`chat.ts`, `contact.ts`, `error-report.ts`), the content schemas (`content.ts`) and the validated profile (`profile.ts`).                                                                                  |
| `server/`                    | The API. `api.ts` routes and validates requests, `prompts.ts` holds the system prompts, `gemini.ts` and `mail.ts` call Gemini and Resend, `lambda.ts` adapts a Lambda function URL event, `dev-plugin.ts` serves the same handler during `vite dev`. |
| `src/app/`                   | The router.                                                                                                                                                                                                                                          |
| `src/components/`            | Shared UI: modal, tooltip, theme toggle, error boundary, page frame, filter chip.                                                                                                                                                                    |
| `src/lib/`                   | Browser helpers: API client, storage, theme, media queries, typewriter pacing.                                                                                                                                                                       |
| `src/content/`               | Lazy loaders for case studies and diagrams.                                                                                                                                                                                                          |
| `src/features/chat/`         | The home page: conversation state, composer, dialogs, usage limits, question lists.                                                                                                                                                                  |
| `src/features/profile/`      | About, Projects and Skills views, with their filtering logic in `projects.ts` and `skills.ts`.                                                                                                                                                       |
| `src/features/case-studies/` | The case study page and its tabs; `pagespeed.ts` calls PageSpeed Insights.                                                                                                                                                                           |
| `src/features/codeos/`       | The Windows 98 style desktop on the Tech Stack tab: window manager, apps, code explorer.                                                                                                                                                             |
| `src/styles/`                | Tailwind theme and the few hand-written stylesheets.                                                                                                                                                                                                 |

## Data flow

**Chat.** The browser sends `{ mode: 'chat', messages }` to `POST /api/chat`. The server checks
the request against `ChatRequestSchema`, screens the last question, builds the system prompt from
`content/profile.json`, and calls Gemini. The prompt never travels from the browser, so a visitor
cannot rewrite it. The same endpoint serves `summary` and `strengths`, the personalised text on
the About view; the browser falls back to the authored text when the API is unavailable.

**Contact.** `POST /api/contact` validates with `ContactRequestSchema`, drops messages that fill
the hidden field, and sends plain text through Resend with the visitor as reply-to.

**Errors.** The error boundary posts a short report, without a stack, to `POST /api/errors` in
production. The server writes it to the log.

**Case studies.** Each case study and diagram is its own lazily loaded chunk. `loadCaseStudy`
validates the JSON with `CaseStudySchema`; the Release tab appears only when a case study has a
live site, and calls PageSpeed Insights from the browser.

## Configuration

Server: `GEMINI_API_KEY`, optional `GEMINI_MODEL` (default `gemini-3.5-flash-lite`),
`RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO`. Browser: optional `VITE_PAGESPEED_API_KEY`.
See `.env.example`.

## Deployment

`npm run build` writes the site to `dist/` and the API to `dist-server/lambda.js`, one file with
its dependencies bundled. Serve `dist/` from static hosting with every unknown path falling back to
`index.html`, and route `/api/*` to a Lambda function URL running `lambda.handler` on Node.js 22 or
newer. Cap the function's reserved concurrency; the per-browser message allowance in the UI is a
courtesy, not a limit.

## Testing

Vitest runs two projects: `node` for `*.test.ts` (logic, server, content) and `dom` for
`*.test.tsx` (components in jsdom with Testing Library). `src/content/content.test.ts` checks every
authored file against its schema, so a content edit that breaks the site fails the suite.
