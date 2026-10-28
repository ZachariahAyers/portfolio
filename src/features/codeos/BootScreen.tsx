import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

/** The start-up screen. Calls onDone once the bar fills. */
export function BootScreen({ active = true, onDone }: { active?: boolean; onDone: () => void }) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const full = progress >= 100;

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      onDone();
      return;
    }
    if (full) {
      const timer = window.setTimeout(onDone, 300);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setInterval(() => setProgress((p) => Math.min(100, p + 5)), 100);
    return () => window.clearInterval(timer);
  }, [active, reduced, full, onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#008080] dark:bg-black"
    >
      <progress
        className="sr-only"
        value={Math.round(progress)}
        max={100}
        aria-label="Loading CodeOS"
      />
      <div className="text-center text-white dark:text-green-400">
        <p className="mb-2 font-['Arial'] text-4xl font-bold">CodeOS 98</p>
        <p className="mb-8 text-sm">Ayers Software Repair</p>
        <div
          className="h-6 w-80 border-2 border-gray-400 bg-gray-800 dark:border-gray-700 dark:bg-gray-900"
          aria-hidden
        >
          <motion.div
            className="h-full bg-linear-to-r from-blue-600 to-blue-400 dark:from-green-600 dark:to-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
          />
        </div>
        <p className="mt-4 text-xs">Starting your desktop…</p>
      </div>
    </motion.div>
  );
}
