# AI Portfolio

[![CI](https://github.com/ZachariahAyers/ai-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/ZachariahAyers/ai-portfolio/actions/workflows/ci.yml)

Zachariah Ayers' portfolio: a chat assistant that answers questions about his work, with case studies and a skills map for hiring managers and clients.

## Features

- Chat with ARLO, an assistant that answers from his authored profile
- Project gallery filtered by type and technology
- Skills map by level and category, with certifications
- Case studies with requirements, before and after, architecture diagrams and results
- A Windows 98 style desktop for browsing each project's code
- Light and dark themes, keyboard friendly, respects reduced motion

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS, React Router, Motion, Mermaid, Zod, Google Gemini, AWS Lambda.

## Getting started

Requires Node.js 22.22 or newer.

```bash
npm install
cp .env.example .env   # add GEMINI_API_KEY for the chat
npm run dev
```

## Development

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm run check   # all of the above, plus the format check
```

How it is put together: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## License

All rights reserved. See [LICENSE](LICENSE).

---

Built by [Zachariah Ayers](https://ayers.repair).
