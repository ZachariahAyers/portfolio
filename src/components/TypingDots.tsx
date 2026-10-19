import { cx } from '../lib/cx.ts';

/** Three bouncing dots that mean "an answer is on its way". */
export function TypingDots({ dotClass = 'bg-gray-400' }: { dotClass?: string }) {
  return (
    <output className="flex items-center gap-1.5" aria-label="Loading">
      <span className={cx('h-2 w-2 animate-bounce rounded-full', dotClass)} />
      <span
        className={cx('h-2 w-2 animate-bounce rounded-full [animation-delay:75ms]', dotClass)}
      />
      <span
        className={cx('h-2 w-2 animate-bounce rounded-full [animation-delay:150ms]', dotClass)}
      />
    </output>
  );
}
