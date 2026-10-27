import { profile } from '../../content/profile.ts';
import { X } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router';
import { loadSource, type SourceFile } from '../../content/source.ts';
import { cx } from '../../lib/cx.ts';
import { useIsMobile } from '../../lib/useMediaQuery.ts';
import { APPS, appById, type DesktopApp } from './apps.ts';
import { BlueScreen } from './BlueScreen.tsx';
import { BootScreen } from './BootScreen.tsx';
import { Clock } from './Clock.tsx';
import { DesktopIcon } from './DesktopIcon.tsx';
import { EmbeddedApp } from './EmbeddedApp.tsx';
import { Notepad } from './Notepad.tsx';
import { PortfolioApp } from './portfolio/PortfolioApp.tsx';
import { ShutdownDialog } from './ShutdownDialog.tsx';
import { StackExplorer } from './StackExplorer.tsx';
import { StartMenu } from './StartMenu.tsx';
import { Window98 } from './Window98.tsx';
import { cascadePosition, desktopReducer, EMPTY_DESKTOP, focusedWindow } from './windowManager.ts';

type Phase = 'booting' | 'running' | 'crashed';

const EXPLORER_POSITION = { x: 100, y: 50 };

/** Tells the page that embeds this desktop in a frame; both pages share an origin. */
const tellParent = (type: 'ayers-codeos-ready' | 'ayers-codeos-close') =>
  window.parent.postMessage({ type }, window.location.origin);

interface CodeOSProps {
  title: string;
  standalone?: boolean;
  embedded?: boolean;
  /** Files from this repository, as paths from its root. */
  source: readonly string[];
}

/** The Code tab: a Windows 98 style desktop whose main app browses real source files. */
export function CodeOS({ title, source, standalone = false, embedded = false }: CodeOSProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>(embedded ? 'running' : 'booting');
  const [desktop, dispatch] = useReducer(desktopReducer<string>, EMPTY_DESKTOP);
  const [mobileApp, setMobileApp] = useState<DesktopApp | null>(null);
  const [shutdownOpen, setShutdownOpen] = useState(false);
  const [files, setFiles] = useState<Record<string, SourceFile[]>>({});
  const focused = focusedWindow(desktop);

  useEffect(() => {
    let active = true;
    loadSource(source)
      .then((loaded) => active && setFiles(loaded))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [source]);

  const booted = useCallback(() => {
    setPhase('running');
    dispatch({
      type: 'open',
      id: standalone ? 'projects' : 'explorer',
      position: EXPLORER_POSITION,
    });
  }, [standalone]);

  // An embedded desktop has no boot screen, so it opens Portfolio itself.
  useEffect(() => {
    if (!embedded) return;
    dispatch({ type: 'open', id: 'projects', position: EXPLORER_POSITION });
    tellParent('ayers-codeos-ready');
  }, [embedded]);

  // Radix menus and dialogs cancel Escape when they use it; only a bare Escape leaves the frame.
  useEffect(() => {
    if (!embedded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) tellParent('ayers-codeos-close');
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [embedded]);

  const restart = useCallback(() => {
    dispatch({ type: 'reset' });
    setMobileApp(null);
    setPhase('booting');
  }, []);

  const launch = (app: DesktopApp) => {
    if (app.kind === 'crash') setPhase('crashed');
    else if (isMobile) setMobileApp(app);
    else dispatch({ type: 'open', id: app.id, position: cascadePosition(desktop.windows.length) });
  };

  const titleOf = (app: DesktopApp) =>
    app.kind === 'explorer' ? `${title} - ${app.name}` : app.name;

  const contentOf = (app: DesktopApp) => {
    if (app.kind === 'projects') return <PortfolioApp profile={profile} />;
    if (app.kind === 'explorer') return <StackExplorer files={files} />;
    if (app.kind === 'notepad') return <Notepad />;
    if (app.url) return <EmbeddedApp url={app.url} title={app.name} />;
    return null;
  };

  const startMenu = (align: 'start' | 'center') => (
    <StartMenu onLaunch={launch} onShutDown={() => setShutdownOpen(true)} align={align} />
  );

  return (
    <div className="win98-desktop relative h-full overflow-hidden">
      <AnimatePresence>
        {phase === 'booting' && <BootScreen projectName={title} onDone={booted} />}
      </AnimatePresence>
      {phase === 'crashed' && <BlueScreen onRestart={restart} />}

      {phase !== 'booting' && !isMobile && (
        <>
          <div className="absolute inset-0 p-2 font-win98">
            <div className="grid w-[160px] grid-cols-2 gap-2">
              {APPS.map((app) => (
                <DesktopIcon key={app.id} app={app} onOpen={() => launch(app)} />
              ))}
            </div>
          </div>

          {desktop.windows.map((w) => {
            const app = appById(w.id);
            if (!app) return null;
            return (
              <Window98
                key={w.id}
                title={titleOf(app)}
                icon={app.icon}
                initialPosition={w.position}
                z={w.z}
                hidden={w.minimized}
                onFocus={() => dispatch({ type: 'focus', id: w.id })}
                onMinimize={() => dispatch({ type: 'minimize', id: w.id })}
                onClose={() => dispatch({ type: 'close', id: w.id })}
              >
                {contentOf(app)}
              </Window98>
            );
          })}

          <footer className="win98-face win98-taskbar absolute right-0 bottom-0 left-0 z-[1000] flex h-10 items-center gap-1 px-2">
            {startMenu('start')}
            <div className="ml-2 flex flex-1 gap-1 overflow-hidden">
              {desktop.windows.map((w) => {
                const app = appById(w.id);
                if (!app) return null;
                const active = focused === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => dispatch({ type: active ? 'minimize' : 'restore', id: w.id })}
                    aria-pressed={active}
                    className={cx(
                      'win98-face flex items-center gap-2 truncate px-3 py-1 text-sm',
                      active ? 'win98-pressed' : 'win98-button',
                    )}
                  >
                    <app.icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="truncate">{titleOf(app)}</span>
                  </button>
                );
              })}
            </div>
            <div className="win98-tray border-l px-2">
              <Clock />
            </div>
          </footer>
        </>
      )}

      {phase !== 'booting' && isMobile && (
        <div className="absolute inset-0 flex flex-col">
          {mobileApp ? (
            <>
              <header className="win98-titlebar flex h-12 items-center justify-between px-3">
                <h2 className="flex items-center gap-2 text-sm font-bold text-white">
                  <mobileApp.icon className="h-5 w-5" aria-hidden />
                  {mobileApp.name}
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileApp(null)}
                  aria-label="Close"
                  className="win98-face win98-button flex h-8 w-8 items-center justify-center"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </header>
              <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
                {contentOf(mobileApp)}
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 overflow-auto p-2">
                <div className="grid grid-cols-4 gap-1">
                  {APPS.map((app) => (
                    <DesktopIcon key={app.id} app={app} onOpen={() => launch(app)} large />
                  ))}
                </div>
              </div>
              <footer className="win98-face win98-taskbar relative flex h-14 items-center justify-center px-3">
                {startMenu('center')}
                <div className="absolute right-3">
                  <Clock showDate={false} />
                </div>
              </footer>
            </>
          )}
        </div>
      )}

      <ShutdownDialog
        open={shutdownOpen}
        onOpenChange={setShutdownOpen}
        onConfirm={() =>
          embedded
            ? tellParent('ayers-codeos-close')
            : standalone
              ? window.location.assign('https://ayers.repair/')
              : void navigate('/')
        }
      />
    </div>
  );
}
