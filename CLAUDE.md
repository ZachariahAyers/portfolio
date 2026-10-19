# Portfolio

Zachariah Ayers' portfolio: a static React site with ARLO, a guide that answers from prepared
answers, plus case studies, projects and skills. Module map and data flow: @docs/ARCHITECTURE.md

## Commands

- `npm run dev` - site on http://localhost:5173
- `npm test` - Vitest, both projects; `npm run test -- src/features/chat` runs one folder
- `npm run typecheck` - `tsc -b` over the app and config projects
- `npm run lint` - oxlint with type-aware rules; warnings fail
- `npm run format` - Prettier, which also sorts Tailwind classes
- `npm run build` - type check, then the site to `dist/` for `/opensource/portfolio/`
- `npm run check` - everything CI runs; run it before calling work done

## Conventions

- TypeScript strict. Validate anything from outside the program (JSON, storage) with zod; no `as` casts on untrusted data.
- Content belongs in `content/`, not in components. Change a schema in `src/content/schema.ts` together with the data.
- Every fact in `content/` comes from Zachariah's résumé or profile notes. Reword, never add.
- ARLO's copy never claims a live AI model, a model name or generated answers. It says its answers come from his records.
- Pure logic lives in plain `.ts` modules beside the component and gets a `*.test.ts`.
- Tailwind classes only; no inline styles except values computed while dragging, passed as CSS variables.
- No emoji in UI or content. Copyright lines read "Ayers Electronics Inc" with no year. The contact address is support@ayers.repair.
- About Northrop Grumman, use only the wording already in `content/profile.json`.

## Definition of done

`npm run check` passes, new behaviour has a test that failed before the change, and docs that
describe the changed behaviour are updated.
