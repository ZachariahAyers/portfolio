import { steadyPacing } from '../../lib/pacing.ts';
import { useTypewriter } from '../../lib/useTypewriter.ts';

function Cursor({ className }: { className: string }) {
  return <span className={`ml-1 inline-block h-4 w-2 animate-pulse ${className}`} aria-hidden />;
}

export function TypedParagraph({ text }: { text: string }) {
  const { visible, done } = useTypewriter(text, steadyPacing);
  return (
    <p className="leading-relaxed text-gray-800 dark:text-gray-300" aria-label={text}>
      {visible}
      {!done && <Cursor className="bg-blue-400" />}
    </p>
  );
}

/** Types the bullets one after another. */
export function TypedBullets({ bullets }: { bullets: string[] }) {
  const full = bullets.join('\n');
  const { visible, done } = useTypewriter(full, steadyPacing);
  const shown = visible.split('\n');
  return (
    <ul className="space-y-3" aria-label="What I can bring to your team">
      {shown.map((bullet, index) => (
        <li key={bullets[index]} className="flex items-start gap-3">
          <span className="mt-1 text-purple-400" aria-hidden>
            ▸
          </span>
          <p className="flex-1 text-gray-800 dark:text-gray-300">
            {bullet}
            {!done && index === shown.length - 1 && <Cursor className="bg-purple-400" />}
          </p>
        </li>
      ))}
    </ul>
  );
}
