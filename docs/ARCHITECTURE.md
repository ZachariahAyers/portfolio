# CodeOS architecture

The deployed application is Ayers Software Repair’s browser desktop. `src/app/router.tsx` sends every hash route to `DesktopPage`; old links still reach the desktop.

## Content

`content/company-projects.json` contains the company portfolio, products and open-source links. `src/content/company.ts` validates it with the existing project schema. Portfolio leads with Northrop Grumman, followed by AmeriSave. Descriptions and attribution come from the current company website.

The retired personal portfolio routes, ARLO answers and case studies remain in repository history/source but are not imported by the deployed app. `src/content/source.ts` exposes only the current desktop’s implementation and company project data to the source explorer.

## Desktop

`src/features/codeos/` owns the loading screen, desktop apps, window manager, taskbar and Start menu. The desktop opens without an app selected on both phones and computers. Phones show an app grid and open one app at a time; computers keep multiple windows. Minimising a window preserves its state.

Portfolio uses an Explorer layout. Arrow, Home and End keys navigate its project tree. Narrow windows switch between the tree and detail, with a Back button. Company information, utilities, the source explorer and the existing games catalogue are separate apps.

## Embedded entrance

The company laptop opens `/opensource/portfolio/?portal=1#/desktop`. The embedded app waits on its loading screen until the parent’s entrance animation reveals it. It accepts the start message only from its same-origin parent.

| Message              | Direction       | Meaning                                     |
| -------------------- | --------------- | ------------------------------------------- |
| `ayers-codeos-ready` | Child to parent | The frame is mounted and ready to reveal.   |
| `ayers-codeos-open`  | Parent to child | Start the visible loading sequence.         |
| `ayers-codeos-close` | Child to parent | Return home after Escape or confirmed exit. |

Escape leaves the frame only if another menu or dialog has not consumed it. Reduced-motion visitors skip the loading animation. A direct visit starts loading immediately.

## Build and checks

Vite produces static files with the base `/opensource/portfolio/`. GitHub Actions runs the checks and deploys that prefix on a push to main. No manual bucket upload is needed.

`npm run check` runs TypeScript, lint, formatting, Vitest and the production build. Tests cover company content, desktop boot, the parent-message boundary, phone app selection, window management and portfolio keyboard navigation.
