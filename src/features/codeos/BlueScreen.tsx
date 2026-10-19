import { useEffect, useRef } from 'react';

/** The joke crash screen. Any key or click restarts. */
export function BlueScreen({ onRestart }: { onRestart: () => void }) {
  const screen = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    screen.current?.focus();
  }, []);

  const line = 'block md:whitespace-nowrap';
  return (
    <button
      ref={screen}
      type="button"
      aria-label="Restart CodeOS"
      onClick={onRestart}
      onKeyDown={onRestart}
      className="fixed inset-0 z-[10000] flex cursor-pointer items-center justify-center bg-[#0000AA] p-4 font-['Courier_New'] text-white outline-hidden md:p-8"
    >
      <span className="block w-full max-w-5xl text-center">
        <span className="mb-4 inline-block bg-[#A8A8A8] px-3 py-1 text-sm font-bold text-[#0000AA] md:mb-8 md:px-6 md:py-2 md:text-xl">
          &nbsp;Windows&nbsp;
        </span>
        <span className="block space-y-2 text-left text-xs leading-relaxed md:space-y-6 md:text-xl">
          <span className={line}>
            A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36.
          </span>
          <span className={line}>The current application will be terminated.</span>
          <span className={line}>* Press any key to terminate the current application.</span>
          <span className={line}>* Press CTRL+ALT+DEL again to restart your computer.</span>
          <span className={line}>
            &nbsp;&nbsp;You will lose any unsaved information in all applications.
          </span>
          <span className="mt-4 block text-center text-base md:text-2xl">
            Press any key to continue _
          </span>
        </span>
        <span className="mt-8 block text-xs opacity-75 md:mt-20 md:text-base">
          <span className={line}>KERNEL32.DLL at 0137:BFF93780</span>
          <span className={line}>
            TECH_STACK_ANALYZER.EXE caused an exception in module DELETED_WIN_32.DLL
          </span>
          <span className={line}>Exception: 0xC0DE0S98 (Too Much Nostalgia)</span>
        </span>
      </span>
    </button>
  );
}
