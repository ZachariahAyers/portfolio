import { animate, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { cx } from '../../lib/cx.ts';

const RADIUS = 40;
const STROKE = 6;
const INNER = RADIUS - STROKE * 2;
const CIRCUMFERENCE = INNER * 2 * Math.PI;

const colour = (score: number) =>
  score >= 90
    ? { text: 'text-green-500', stroke: 'stroke-green-500' }
    : score >= 50
      ? { text: 'text-yellow-500', stroke: 'stroke-yellow-500' }
      : { text: 'text-red-500', stroke: 'stroke-red-500' };

/** A Lighthouse score (0-100) as a ring that fills and counts up. */
export function ScoreRing({
  score,
  label,
  delay,
}: {
  score: number;
  label: string;
  delay: number;
}) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1,
      delay: delay / 1000,
      onUpdate: (value) => setShown(Math.round(value)),
    });
    return () => controls.stop();
  }, [score, delay]);

  const { text, stroke } = colour(shown);
  return (
    <figure className="flex flex-col items-center text-center">
      <div className="relative">
        <svg height={RADIUS * 2} width={RADIUS * 2} className="-rotate-90" aria-hidden>
          <circle
            className="stroke-gray-300 dark:stroke-gray-700"
            fill="transparent"
            strokeWidth={STROKE}
            r={INNER}
            cx={RADIUS}
            cy={RADIUS}
          />
          <motion.circle
            className={stroke}
            fill="transparent"
            strokeWidth={STROKE}
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE }}
            transition={{ duration: 1, delay: delay / 1000, ease: 'easeOut' }}
            r={INNER}
            cx={RADIUS}
            cy={RADIUS}
          />
        </svg>
        <span
          className={cx(
            'absolute inset-0 flex items-center justify-center text-2xl font-bold',
            text,
          )}
        >
          {shown}
        </span>
      </div>
      <figcaption className="mt-1 text-xs">{label}</figcaption>
    </figure>
  );
}
