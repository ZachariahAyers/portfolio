# Portfolio

[![CI](https://github.com/ZachariahAyers/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/ZachariahAyers/portfolio/actions/workflows/ci.yml)

Zachariah Ayers' portfolio, live at [ayers.repair/opensource/portfolio](https://ayers.repair/opensource/portfolio/).

## Features

- ARLO, a guide that answers questions about Zach's work from answers prepared in advance from his résumé and project notes
- Projects filtered by type and technology
- Skills by category, with search
- Case studies with before and after, and results
- A Windows 98 style desktop for browsing this repository's source

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

Built by [Zachariah Ayers](https://ayers.repair).
