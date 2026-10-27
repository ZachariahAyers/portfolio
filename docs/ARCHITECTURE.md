# Architecture

A single-page React app built to static files. There is no server: the content lives in JSON
files, apart from the code that renders it, and ships with the site.

## Module map

| Path                         | Holds                                                                                                                 |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `content/`                   | Authored data: `profile.json`, `answers.json` (ARLO's prepared answers), `case-studies/*.json`.                       |
| `src/content/`               | The zod schemas (`schema.ts`), the validated profile and answers, and lazy loaders for case studies and source files. |
| `src/app/`                   | The router.                                                                                                           |
| `src/components/`            | Shared UI: modal, tooltip, theme toggle, error boundary, page frame, filter chip.                                     |
| `src/lib/`                   | Browser helpers: asset paths, storage, theme, media queries, typewriter pacing.                                       |
| `src/features/chat/`         | The home page: ARLO, the answer matcher (`match.ts`), question lists, dialogs.                                        |
| `src/features/profile/`      | About, Projects and Skills views, with their filtering logic in `projects.ts` and `skills.ts`.                        |
| `src/features/case-studies/` | The case study page and its tabs.                                                                                     |
| `src/features/codeos/`       | The Windows 98 style desktop on the Code tab: window manager, apps, source explorer.                                  |
| `src/styles/`                | Tailwind theme and the few hand-written stylesheets.                                                                  |

## Data flow

**ARLO.** `content/answers.json` holds every prepared question with its answer, topic, keywords
and follow-ups. A picked question shows its own answer. A typed question goes through
`matchAnswer`: an exact question wins; otherwise the answer with the most keywords found in the
question, ties going to the answer listed first. Words are compared in lower case, without
punctuation or simple plurals. When no keyword matches, ARLO gives the fallback line and offers
the starter questions. Nothing calls a model; the footer says the answers come from Zach's
records.

**Case studies.** Each case study is its own lazily loaded chunk, validated with
`CaseStudySchema`. The Overview tab always shows; Before and After, Results and Code show only
when the case study has that content. The Code tab loads the files the case study lists from this
repository as text (`src/content/source.ts`), so what it shows is the code that runs.

## Routing and hosting

The site is served from `https://ayers.repair/opensource/portfolio/`, a folder on a static host.
It uses hash routing (`/#/projects`, `/#/casestudies/portfolio?tab=code`): every page loads from
the one `index.html`, so a refresh or a shared link never asks the host for a file it does not
have, and no rewrite rule is needed. `vite build` sets `base` to `/opensource/portfolio/`; code
that builds a URL to a file in `public/` uses `asset()` from `src/lib/asset.ts`.

## Testing

Vitest runs two projects: `node` for `*.test.ts` (logic and content) and `dom` for `*.test.tsx`
(components in jsdom with Testing Library). `src/content/content.test.ts` checks every authored
file against its schema, every Code tab path against the repository, and the contact address, so
a content edit that breaks the site fails the suite. `src/features/chat/match.test.ts` pins how
typed questions reach their answers.

The `/#/desktop` route opens CodeOS without case-study chrome. Its Portfolio window uses the existing project views; Arcade embeds the company games catalogue at `/games.html?embed=codeos`. Shut Down returns to ayers.repair.
