import type { ReactNode } from 'react';
import { cx } from '../lib/cx.ts';
import { Tooltip } from './Tooltip.tsx';

export type ChipColor = 'blue' | 'green' | 'purple' | 'amber' | 'orange';

const activeClass: Record<ChipColor, string> = {
  blue: 'bg-blue-600 text-white',
  green: 'bg-green-600 text-white',
  purple: 'bg-purple-600 text-white',
  amber: 'bg-amber-600 text-white',
  orange: 'bg-orange-600 text-white',
};

interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  tooltip: string;
  color?: ChipColor;
  disabled?: boolean;
  children: ReactNode;
}

/** Toggle button used by the project and skill filters. */
export function FilterChip({
  active,
  onClick,
  tooltip,
  color = 'blue',
  disabled = false,
  children,
}: FilterChipProps) {
  return (
    <Tooltip content={tooltip}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-pressed={active}
        className={cx(
          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-all sm:px-3 sm:py-1 sm:text-sm',
          disabled
            ? 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
            : active
              ? activeClass[color]
              : 'bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
        )}
      >
        {children}
      </button>
    </Tooltip>
  );
}
