export interface Position {
  x: number;
  y: number;
}

export interface WindowState<Id extends string = string> {
  id: Id;
  z: number;
  minimized: boolean;
  position: Position;
}

export interface DesktopState<Id extends string = string> {
  windows: WindowState<Id>[];
  nextZ: number;
}

export type DesktopAction<Id extends string = string> =
  | { type: 'open'; id: Id; position: Position }
  | { type: 'focus'; id: Id }
  | { type: 'minimize'; id: Id }
  | { type: 'close'; id: Id }
  | { type: 'reset' };

export const EMPTY_DESKTOP: DesktopState<never> = { windows: [], nextZ: 1 };

const raise = <Id extends string>(state: DesktopState<Id>, id: Id): DesktopState<Id> => ({
  windows: state.windows.map((w) => (w.id === id ? { ...w, z: state.nextZ, minimized: false } : w)),
  nextZ: state.nextZ + 1,
});

/** Window stacking for the desktop: opening or focusing a window brings it to the front. */
export function desktopReducer<Id extends string>(
  state: DesktopState<Id>,
  action: DesktopAction<Id>,
): DesktopState<Id> {
  switch (action.type) {
    case 'open':
      if (state.windows.some((w) => w.id === action.id)) return raise(state, action.id);
      return {
        windows: [
          ...state.windows,
          { id: action.id, z: state.nextZ, minimized: false, position: action.position },
        ],
        nextZ: state.nextZ + 1,
      };
    case 'focus':
      return focusedWindow(state) === action.id ? state : raise(state, action.id);
    case 'minimize':
      return {
        ...state,
        windows: state.windows.map((w) => (w.id === action.id ? { ...w, minimized: true } : w)),
      };
    case 'close':
      return { ...state, windows: state.windows.filter((w) => w.id !== action.id) };
    case 'reset':
      return EMPTY_DESKTOP;
  }
}

/** The front-most window that is not minimized. */
export function focusedWindow<Id extends string>(state: DesktopState<Id>): Id | undefined {
  return state.windows
    .filter((w) => !w.minimized)
    .reduce<WindowState<Id> | undefined>((top, w) => (!top || w.z > top.z ? w : top), undefined)
    ?.id;
}

/** Where a newly opened window goes: cascaded down and right from the last one. */
export const cascadePosition = (openCount: number): Position => ({
  x: 150 + openCount * 30,
  y: 50 + openCount * 30,
});
