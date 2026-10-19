# Changelog

## 2.0.0

A rebuild, renamed from ai-portfolio to portfolio.

- Every fact on the site comes from Zachariah's résumé and profile notes. Content that did not trace to them is removed, leaving fewer, true case studies.
- ARLO answers from prepared answers in `content/answers.json`, matched to typed questions by keyword, and says so on the page. The Gemini chat, the Lambda API, the contact form, error reporting and the PageSpeed calls are removed, with their environment variables.
- The site is static files served from `ayers.repair/opensource/portfolio/`, with hash routing so any page survives a refresh.
- The Code tab browses this repository's own source.
- TypeScript throughout, on React 19, Vite 8, Tailwind CSS 4, React Router 8 and Motion.
- Content is checked against zod schemas, in the browser and in the test suite.
- Accessible dialogs, menus and controls; reduced motion respected.
- Fixed: the code explorer's highlighter corrupted its own markup; it now uses Prism tokens.
- Fixed: hooks called conditionally, a crash on the CodeOS restart button, and number keys switching tabs while typing.
- Removed: dead links, git submodules, unused files and dependencies (Mermaid among them), salary and target-company data.
- Vitest suites, oxlint, Prettier, CI and Dependabot.

## 1.0.0

The original JavaScript site: React, Vite and Tailwind CSS, with the chat backed by a separate AWS Lambda.
