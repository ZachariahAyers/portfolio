import { useEffect, useState } from 'react';
import { cx } from '../../lib/cx.ts';

const SEGMENTS = 20;

/** A third-party web tool in an iframe, behind a period progress bar while it loads. */
export function EmbeddedApp({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loaded) return;
    const timer = window.setInterval(
      () => setProgress((p) => (p >= 90 ? p : p + Math.random() * 15)),
      300,
    );
    return () => window.clearInterval(timer);
  }, [loaded]);

  const filled = Math.floor(((loaded ? 100 : progress) / 100) * SEGMENTS);

  return (
    <div className="relative h-full w-full">
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#c0c0c0] dark:bg-gray-900">
          <div className="win98-face win98-raised p-6">
            <progress
              className="sr-only"
              value={Math.round(progress)}
              max={100}
              aria-label={`Loading ${title}`}
            />
            <p className="mb-4 text-sm font-bold text-black dark:text-gray-200">
              Loading {title}...
            </p>
            <div className="win98-sunken h-6 w-64 bg-white p-1 dark:bg-gray-900" aria-hidden>
              <div className="flex h-full gap-0.5">
                {Array.from({ length: SEGMENTS }, (_, i) => (
                  <div
                    key={i}
                    className={cx(
                      'h-full flex-1',
                      i < filled
                        ? 'bg-[#000080] dark:bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-800',
                    )}
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              {Math.round(progress)}% complete
            </p>
          </div>
        </div>
      )}
      <iframe
        src={url}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={cx('h-full w-full', !loaded && 'invisible')}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
