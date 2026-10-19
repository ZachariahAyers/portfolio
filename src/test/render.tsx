import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';
import { TooltipProvider } from '../components/Tooltip.tsx';

/** Renders inside the providers every page has: a router and the tooltip provider. */
export function renderPage(ui: ReactElement, path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <TooltipProvider>{ui}</TooltipProvider>
    </MemoryRouter>,
  );
}

/** Makes `prefers-reduced-motion` match so typed text appears at once. */
export function preferReducedMotion() {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  });
}
