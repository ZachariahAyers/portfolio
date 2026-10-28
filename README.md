# Portfolio

[![CI](https://github.com/ZachariahAyers/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/ZachariahAyers/portfolio/actions/workflows/ci.yml)

Ayers Software Repair’s browser desktop, live at [ayers.repair/opensource/portfolio](https://ayers.repair/opensource/portfolio/).

## Features

- A loading screen followed by the desktop on phones and computers
- Company portfolio and products, with descriptions and links from the company site
- Utilities, games and a source-code explorer
- An embedded entrance from the company homepage’s laptop; Escape returns home

Company content lives in `content/company-projects.json`. The router serves the desktop for every route. The retired personal portfolio, ARLO answers and case-study content are not included in the application bundle or its source explorer.

When embedded, the desktop signals `ayers-codeos-ready` and waits for `ayers-codeos-open` from its same-origin parent before starting the loading screen. This keeps loading visible after the laptop entrance animation.

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS, React Router, Motion, Zod and Vitest. The site is static files with no server.

## Getting started

Requires Node.js 22.22 or newer.

```bash
git clone https://github.com/ZachariahAyers/portfolio.git
cd portfolio
npm ci
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

Built by [Ayers Software Repair](https://ayers.repair).
