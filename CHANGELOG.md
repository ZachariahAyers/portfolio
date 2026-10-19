# Changelog

## Unreleased

- Fixed: the touch icon's declared size now matches the 1024 by 1024 image.
- Removed: the Event Loop Viewer app, whose host page no longer exists, and the `robots.txt` that a subpath never serves.

## 2.0.0

Zachariah Ayers's portfolio: projects, case studies, and a guide that answers from his records.

- Every fact on the site comes from Zachariah's résumé and profile notes.
- ARLO answers from prepared answers in `content/answers.json`, matched to typed questions by keyword, and says so on the page.
- Static files served from `ayers.repair/opensource/portfolio/`, with hash routing so any page survives a refresh.
- The Code tab browses this repository's own source, highlighted with Prism tokens.
- TypeScript throughout, on React 19, Vite 8, Tailwind CSS 4, React Router 8 and Motion.
- Content is checked against zod schemas, in the browser and in the test suite.
- Accessible dialogs, menus and controls; reduced motion respected.
- Vitest suites, oxlint, Prettier, CI and Dependabot.
