import {
  AlertTriangle,
  CircuitBoard,
  Code2,
  Grid3x3,
  type LucideIcon,
  NotebookPen,
  Palette,
  Radio,
  Regex,
  Satellite,
  Sparkles,
} from 'lucide-react';

export type AppKind = 'explorer' | 'notepad' | 'embed' | 'crash';

export interface DesktopApp {
  id: string;
  name: string;
  icon: LucideIcon;
  kind: AppKind;
  /** Third-party tool shown in an iframe. */
  url?: string;
}

export const APPS: readonly DesktopApp[] = [
  { id: 'explorer', name: 'Code Explorer', icon: Code2, kind: 'explorer' },
  { id: 'paint', name: 'Excalidraw', icon: Palette, kind: 'embed', url: 'https://excalidraw.com/' },
  {
    id: 'circuit',
    name: 'Circuit Sim',
    icon: CircuitBoard,
    kind: 'embed',
    url: 'https://www.falstad.com/circuit/circuitjs.html',
  },
  {
    id: 'space',
    name: 'ISS Tracker',
    icon: Satellite,
    kind: 'embed',
    url: 'https://www.n2yo.com/satellite/?s=25544',
  },
  {
    id: 'waves',
    name: 'Wave Lab',
    icon: Radio,
    kind: 'embed',
    url: 'https://phet.colorado.edu/sims/html/wave-interference/latest/wave-interference_en.html',
  },
  { id: 'regex', name: 'RegEx Tool', icon: Regex, kind: 'embed', url: 'https://regexr.com/' },
  { id: 'notepad', name: 'Notepad', icon: NotebookPen, kind: 'notepad' },
  {
    id: 'wigglypaint',
    name: 'Wiggly Paint',
    icon: Sparkles,
    kind: 'embed',
    url: 'https://wigglypaint.net/assets/content/wiggly_1_3_1.html',
  },
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    icon: Grid3x3,
    kind: 'embed',
    url: 'https://codepen.io/kfalencik/embed/LYrpdPp/?theme-id=modal&default-tab=result&editable=false',
  },
  { id: 'crash', name: 'Crash System', icon: AlertTriangle, kind: 'crash' },
];

export const appById = (id: string) => APPS.find((app) => app.id === id);
