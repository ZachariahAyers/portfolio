import { useNow } from '../../lib/useNow.ts';

export function Clock({ showDate = true }: { showDate?: boolean }) {
  const now = useNow(1000);
  return (
    <time
      dateTime={now.toISOString()}
      title={now.toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
      className="flex flex-col items-center justify-center px-2 py-1 text-xs text-black dark:text-gray-300"
    >
      <span>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      {showDate && (
        <span className="text-[10px]">
          {now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: '2-digit' })}
        </span>
      )}
    </time>
  );
}
