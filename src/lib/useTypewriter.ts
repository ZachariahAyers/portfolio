import { useEffect, useRef, useState } from 'react';
import type { Pacing } from './pacing.ts';
import { usePrefersReducedMotion } from './useMediaQuery.ts';

/**
 * Reveals `text` over time at the given pacing. Visitors who prefer reduced
 * motion get the full text at once. Give the component a `key` of the text so a
 * new text starts from the beginning.
 */
export function useTypewriter(text: string, pacing: Pacing, onDone?: () => void) {
  const reduceMotion = usePrefersReducedMotion();
  const [shown, setShown] = useState(0);
  const end = reduceMotion ? text.length : Math.min(shown, text.length);
  const done = end >= text.length;
  const reported = useRef(false);

  useEffect(() => {
    if (done) {
      if (!reported.current) {
        reported.current = true;
        onDone?.();
      }
      return;
    }
    const step = pacing(text, end);
    const timer = window.setTimeout(() => setShown(step.end), step.delay);
    return () => window.clearTimeout(timer);
  }, [done, end, onDone, pacing, text]);

  return { visible: text.slice(0, end), done };
}
