import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { applyTheme, initialTheme, saveTheme, type Theme } from '../lib/theme.ts';
import { Tooltip } from './Tooltip.tsx';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  const label = `Switch to ${next} mode`;

  const toggle = () => {
    setTheme(next);
    applyTheme(next);
    saveTheme(next);
  };

  return (
    <Tooltip content={label}>
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        className="group rounded-lg bg-gray-200 p-2 transition-all duration-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-yellow-500 transition-transform duration-500 group-hover:rotate-180" />
        ) : (
          <Moon className="h-5 w-5 text-gray-700 transition-transform duration-500 group-hover:-rotate-12" />
        )}
      </button>
    </Tooltip>
  );
}
