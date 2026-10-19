# Changelog

## 2.0.0

A rebuild on the same content and features.

- TypeScript throughout, on React 19, Vite 8, Tailwind CSS 4, React Router 8, Motion and Mermaid 12.
- The chat, contact and error endpoints are part of the repository (`server/`), run in `vite dev`, and deploy as one Lambda function. The system prompt moved to the server.
- Content moved to `content/` and is checked against zod schemas, in the browser and in the test suite.
- The assistant says it is an AI assistant when sincerely asked.
- Accessible dialogs, menus and controls; reduced motion respected.
- Fixed: the Release tab no longer shows invented Lighthouse scores, and appears only for projects with a live site.
- Fixed: case study pages no longer fill gaps with invented requirements, attachments, priorities or dates.
- Fixed: the code explorer's highlighter corrupted its own markup; it now uses Prism tokens.
- Fixed: hooks called conditionally, a crash on the CodeOS restart button, and number keys switching tabs while typing.
- Removed: dead links, git submodules, unused files and dependencies, salary and target-company data.
- Vitest suites, oxlint, Prettier, CI and Dependabot.

## 1.0.0

The original JavaScript site: React, Vite and Tailwind CSS, with the chat backed by a separate AWS Lambda.
