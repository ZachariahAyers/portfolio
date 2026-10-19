import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { type CSSProperties, type PointerEvent, useRef, useState } from 'react';
import type { CaseStudy } from '../../../shared/content.ts';
import { Modal } from '../../components/Modal.tsx';
import { cx } from '../../lib/cx.ts';
import { TabHeading } from './TabHeading.tsx';

type Side = 'before' | 'after';

const clamp = (value: number) => Math.max(0, Math.min(100, value));

function Points({
  side,
  points,
  onSelect,
}: {
  side: Side;
  points: string[];
  onSelect: (text: string) => void;
}) {
  return (
    <ul className="space-y-4">
      {points.map((point, index) => (
        <motion.li
          key={point}
          initial={{ opacity: 0, x: side === 'before' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onSelect(point)}
            className="flex items-center gap-3 text-left text-lg text-gray-900 transition-transform hover:translate-x-2 dark:text-white"
          >
            <span
              className={cx(
                'h-2 w-2 shrink-0 animate-pulse rounded-full',
                side === 'before' ? 'bg-red-400' : 'bg-green-400',
              )}
            />
            {point}
          </button>
        </motion.li>
      ))}
    </ul>
  );
}

/** Before and after, compared with a draggable divider. */
export function ProblemTab({ section }: { section: CaseStudy['problem'] }) {
  const [position, setPosition] = useState(50);
  const [selected, setSelected] = useState<{ side: Side; text: string } | null>(null);
  const dragging = useRef(false);
  /** The divider position, read by the .slider-reveal and .slider-handle rules. */
  const reveal: CSSProperties = { '--reveal': `${position}%` };

  const moveTo = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition(clamp(((event.clientX - rect.left) / rect.width) * 100));
  };

  return (
    <div className="flex h-full flex-col bg-gray-200 p-4 md:p-8 dark:bg-gray-900">
      <TabHeading
        title={section.title}
        subtitle="Drag the slider to see what I fixed - broken system on the left, my solution on the right"
      />
      <div className="relative flex-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mx-auto h-full max-w-6xl touch-none overflow-hidden rounded-lg border border-gray-300 select-none md:rounded-2xl dark:border-blue-500/20"
          onPointerDown={(event) => {
            dragging.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            moveTo(event);
          }}
          onPointerMove={(event) => dragging.current && moveTo(event)}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
        >
          <div className="absolute inset-0 z-10 bg-linear-to-br from-red-900/20 to-red-600/20">
            <div className="flex h-full flex-col justify-center p-12">
              <div className="ml-[15%] max-w-xl">
                <h3 className="mb-6 flex items-center gap-3 text-2xl font-light text-red-400">
                  <AlertTriangle className="h-8 w-8" aria-hidden />
                  {section.before.label}
                </h3>
                <Points
                  side="before"
                  points={section.before.points}
                  onSelect={(text) => setSelected({ side: 'before', text })}
                />
              </div>
            </div>
          </div>

          <div className="slider-reveal absolute inset-0 z-20" style={reveal}>
            <div className="absolute inset-0 bg-linear-to-r from-gray-900 via-gray-900/95 to-transparent dark:from-black dark:via-gray-950/95 dark:to-transparent" />
            <div className="absolute inset-0 bg-linear-to-br from-green-600/50 to-green-900/50" />
            <div className="relative flex h-full flex-col justify-center p-12">
              <div className="mr-[15%] ml-auto max-w-xl">
                <h3 className="mb-6 flex items-center gap-3 text-2xl font-light text-green-400">
                  <CheckCircle2 className="h-8 w-8" aria-hidden />
                  {section.after.label}
                </h3>
                <Points
                  side="after"
                  points={section.after.points}
                  onSelect={(text) => setSelected({ side: 'after', text })}
                />
              </div>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(position)}
            onChange={(event) => setPosition(clamp(Number(event.target.value)))}
            onPointerDown={(event) => event.stopPropagation()}
            aria-label="Compare before and after"
            className="peer sr-only"
          />
          <div
            className="slider-handle absolute top-0 bottom-0 z-30 w-1 cursor-ew-resize bg-blue-600 peer-focus-visible:outline-4 peer-focus-visible:outline-blue-300 dark:bg-blue-400"
            style={reveal}
            aria-hidden
          >
            <div className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-pulse items-center justify-center rounded-full bg-blue-600/20 dark:bg-blue-400/20">
              <div className="h-6 w-6 rounded-full bg-blue-600 dark:bg-blue-400" />
            </div>
          </div>

          <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-48 w-full" aria-hidden>
            <defs>
              <linearGradient id="problem-wave-before" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="problem-wave-after" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,100 Q50,50 100,100 T200,100 T300,100 T400,100"
              fill="none"
              stroke="url(#problem-wave-before)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.path
              d="M400,100 Q450,150 500,100 T600,100 T700,100 T800,100"
              fill="none"
              stroke="url(#problem-wave-after)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      </div>

      <Modal
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
        title={
          <span className="flex items-center gap-2">
            {selected?.side === 'before' ? (
              <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-green-400" aria-hidden />
            )}
            {selected?.side === 'before' ? 'Problem' : 'Solution'}
          </span>
        }
      >
        <p className="p-6 text-gray-700 dark:text-gray-300">{selected?.text}</p>
      </Modal>
    </div>
  );
}
