import { cx } from '../../lib/cx.ts';
import type { DesktopApp } from './apps.ts';

export function DesktopIcon({
  app,
  onOpen,
  large = false,
}: {
  app: DesktopApp;
  onOpen: () => void;
  large?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cx(
        'group font-smoothing-none flex flex-col items-center rounded-xs p-1 outline-hidden',
        !large && 'h-[75px] w-[75px] hover:bg-blue-600/20 focus-visible:bg-blue-600/30',
      )}
    >
      <span className="relative mb-1">
        <span
          className={cx(
            'win98-face win98-icon-frame flex items-center justify-center',
            large ? 'h-12 w-12' : 'h-8 w-8',
          )}
        >
          <app.icon
            className={cx('text-black dark:text-white', large ? 'h-6 w-6' : 'h-5 w-5')}
            strokeWidth={large ? 2 : 1}
            aria-hidden
          />
        </span>
        {!large && (
          <span
            className="pointer-events-none absolute inset-0 translate-x-0.5 translate-y-0.5 bg-black opacity-30"
            aria-hidden
          />
        )}
      </span>
      <span
        className={cx(
          'win98-icon-label w-full rounded-xs px-1 py-0.5 text-center leading-tight wrap-break-word text-white',
          large
            ? 'text-xs'
            : 'text-[11px] tracking-[0.5px] group-hover:bg-[#000080] group-focus-visible:bg-[#000080] dark:group-hover:bg-blue-600',
        )}
      >
        {app.name}
      </span>
    </button>
  );
}
