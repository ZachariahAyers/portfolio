import { type LucideIcon, Minus, Square, X } from 'lucide-react';
import { type CSSProperties, type PointerEvent, type ReactNode, useRef, useState } from 'react';
import { clampPosition, type Position, type Size, TASKBAR_HEIGHT } from './windowManager.ts';

const MIN_SIZE: Size = { width: 400, height: 300 };
const DEFAULT_SIZE: Size = { width: 800, height: 600 };

interface Window98Props {
  title: string;
  icon: LucideIcon;
  initialPosition: Position;
  z: number;
  /** Minimised windows stay mounted, so their content keeps its state. */
  hidden: boolean;
  onFocus: () => void;
  onMinimize: () => void;
  onClose: () => void;
  children: ReactNode;
}

type Gesture = { kind: 'move' | 'resize'; startX: number; startY: number; origin: Position & Size };

/** A draggable, resizable, maximisable window. */
export function Window98({
  title,
  icon: Icon,
  initialPosition,
  z,
  hidden,
  onFocus,
  onMinimize,
  onClose,
  children,
}: Window98Props) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [maximized, setMaximized] = useState(false);
  const gesture = useRef<Gesture | null>(null);
  const root = useRef<HTMLElement>(null);

  const start = (kind: Gesture['kind']) => (event: PointerEvent<HTMLElement>) => {
    if (maximized || (event.target instanceof Element && event.target.closest('button'))) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = {
      kind,
      startX: event.clientX,
      startY: event.clientY,
      origin: { ...position, ...size },
    };
    onFocus();
  };

  const move = (event: PointerEvent<HTMLElement>) => {
    const g = gesture.current;
    if (!g) return;
    const dx = event.clientX - g.startX;
    const dy = event.clientY - g.startY;
    if (g.kind === 'move') setPosition({ x: g.origin.x + dx, y: g.origin.y + dy });
    else
      setSize({
        width: Math.max(MIN_SIZE.width, g.origin.width + dx),
        height: Math.max(MIN_SIZE.height, g.origin.height + dy),
      });
  };

  const end = () => {
    const g = gesture.current;
    gesture.current = null;
    const desktop = root.current?.parentElement;
    if (g?.kind !== 'move' || !desktop) return;
    const bounds = { width: desktop.clientWidth, height: desktop.clientHeight - TASKBAR_HEIGHT };
    setPosition((p) => clampPosition(p, size, bounds));
  };

  /** Window geometry changes with every drag, so it is passed as CSS variables read by .win98-window. */
  const geometry: CSSProperties = {
    '--win-x': `${position.x}px`,
    '--win-y': `${position.y}px`,
    '--win-w': `${size.width}px`,
    '--win-h': `${size.height}px`,
    '--win-z': z,
  };

  return (
    <section
      ref={root}
      hidden={hidden}
      className={maximized ? 'win98-window win98-window-maximized' : 'win98-window'}
      style={geometry}
      onPointerDown={onFocus}
      aria-label={title}
    >
      <div className="win98-face win98-raised relative flex flex-1 flex-col">
        <header
          className="win98-titlebar flex h-8 cursor-move items-center justify-between px-1 select-none"
          onPointerDown={start('move')}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onDoubleClick={() => setMaximized((m) => !m)}
        >
          <h2 className="flex items-center gap-2 text-sm font-bold text-white">
            <Icon className="h-4 w-4" aria-hidden />
            {title}
          </h2>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={onMinimize}
              aria-label="Minimize"
              className="win98-face win98-button flex h-6 w-6 items-center justify-center"
            >
              <Minus className="h-3 w-3" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setMaximized((m) => !m)}
              aria-label={maximized ? 'Restore' : 'Maximize'}
              className="win98-face win98-button flex h-6 w-6 items-center justify-center"
            >
              <Square className="h-3 w-3" aria-hidden />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="win98-face win98-button flex h-6 w-6 items-center justify-center"
            >
              <X className="h-3 w-3" aria-hidden />
            </button>
          </div>
        </header>
        <div className="m-1 flex-1 overflow-auto bg-white dark:bg-gray-900">{children}</div>
        {!maximized && (
          <div
            className="win98-resize-handle absolute right-0 bottom-0 h-4 w-4 cursor-se-resize"
            onPointerDown={start('resize')}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
            aria-hidden
          />
        )}
      </div>
    </section>
  );
}
