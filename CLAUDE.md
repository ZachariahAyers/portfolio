# AI Portfolio

Zachariah Ayers' portfolio site: a React chat front end, case studies and a skills map, with a
small Gemini-backed API. Module map and data flow: @docs/ARCHITECTURE.md

## Commands

- `npm run dev` - site on http://localhost:5173 with the API mounted at `/api` (needs `.env`)
- `npm test` - Vitest, both projects; `npm run test -- src/features/chat` runs one folder
- `npm run typecheck` - `tsc -b` over the app, server and config projects
- `npm run lint` - oxlint with type-aware rules; warnings fail
- `npm run format` - Prettier, which also sorts Tailwind classes
- `npm run build` - type check, site to `dist/`, Lambda bundle to `dist-server/`
- `npm run check` - everything CI runs; run it before calling work done

## Conventions

- TypeScript strict. Validate anything from outside the program (JSON, storage, network) with zod; no `as` casts on untrusted data.
- Content belongs in `content/`, not in components. Change a schema in `shared/content.ts` together with the data.
- Pure logic lives in plain `.ts` modules beside the component and gets a `*.test.ts`.
- Tailwind classes only; no inline styles except values computed while dragging, passed as CSS variables.
- No emoji in UI or content. Copyright lines read "Ayers Electronics Inc" with no year.
- The system prompt stays on the server. Never send prompt text or API keys to the browser.
- About Northrop Grumman, use only the wording already in `content/profile.json`.

## Definition of done

`npm run check` passes, new behaviour has a test that failed before the change, and docs that
describe the changed behaviour are updated.
