import { z } from 'zod';
import { readStored, writeStored } from './storage.ts';

const ThemeSchema = z.enum(['light', 'dark']);
export type Theme = z.infer<typeof ThemeSchema>;

const STORAGE_KEY = 'portfolio.theme';

export function initialTheme(): Theme {
  const stored = readStored(STORAGE_KEY, ThemeSchema.nullable(), null);
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function saveTheme(theme: Theme): void {
  writeStored(STORAGE_KEY, theme);
}
