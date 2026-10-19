import { useEffect, useState } from 'react';
import { cachedReport, fetchReport, type PageSpeedReport } from './pagespeed.ts';

export type PageSpeedState =
  | { status: 'loading' }
  | { status: 'failed' }
  | { status: 'ready'; report: PageSpeedReport; cachedMinutesAgo: number | null };

function fromCache(url: string): PageSpeedState | undefined {
  const entry = cachedReport(url);
  return (
    entry && {
      status: 'ready',
      report: entry.report,
      cachedMinutesAgo: Math.floor((Date.now() - entry.savedAt) / 60_000),
    }
  );
}

/** Runs PageSpeed Insights for a URL. Key the caller by URL so a new URL starts fresh. */
export function usePageSpeed(url: string): PageSpeedState {
  const [state, setState] = useState<PageSpeedState>(() => fromCache(url) ?? { status: 'loading' });
  const needsFetch = state.status === 'loading';

  useEffect(() => {
    if (!needsFetch) return;
    let active = true;
    fetchReport(url)
      .then((report) => active && setState({ status: 'ready', report, cachedMinutesAgo: null }))
      .catch(() => active && setState({ status: 'failed' }));
    return () => {
      active = false;
    };
  }, [needsFetch, url]);

  return state;
}
