import { describe, expect, it } from 'vitest';
import {
  cascadePosition,
  clampPosition,
  type DesktopState,
  desktopReducer,
  EMPTY_DESKTOP,
  focusedWindow,
} from './windowManager.ts';

const at = { x: 0, y: 0 };
const open = (state: DesktopState, id: string) =>
  desktopReducer(state, { type: 'open', id, position: at });

describe('desktop windows', () => {
  it('opens windows on top of each other', () => {
    const state = open(open(EMPTY_DESKTOP, 'a'), 'b');
    expect(state.windows.map((w) => [w.id, w.z])).toEqual([
      ['a', 1],
      ['b', 2],
    ]);
    expect(focusedWindow(state)).toBe('b');
  });

  it('reopening a window raises it instead of adding a copy', () => {
    const state = open(open(open(EMPTY_DESKTOP, 'a'), 'b'), 'a');
    expect(state.windows).toHaveLength(2);
    expect(focusedWindow(state)).toBe('a');
  });

  it('focusing the front window changes nothing', () => {
    const state = open(EMPTY_DESKTOP, 'a');
    expect(desktopReducer(state, { type: 'focus', id: 'a' })).toBe(state);
  });

  it('minimising hands focus to the next window, and focusing restores it', () => {
    let state = open(open(EMPTY_DESKTOP, 'a'), 'b');
    state = desktopReducer(state, { type: 'minimize', id: 'b' });
    expect(focusedWindow(state)).toBe('a');
    state = desktopReducer(state, { type: 'focus', id: 'b' });
    expect(state.windows.find((w) => w.id === 'b')?.minimized).toBe(false);
    expect(focusedWindow(state)).toBe('b');
  });

  it('restoring a minimised window shows it and brings it to the front', () => {
    let state = open(open(EMPTY_DESKTOP, 'a'), 'b');
    state = desktopReducer(state, { type: 'minimize', id: 'a' });
    state = desktopReducer(state, { type: 'restore', id: 'a' });
    expect(state.windows.find((w) => w.id === 'a')?.minimized).toBe(false);
    expect(focusedWindow(state)).toBe('a');
  });

  it('restoring a window behind another raises it', () => {
    const state = desktopReducer(open(open(EMPTY_DESKTOP, 'a'), 'b'), { type: 'restore', id: 'a' });
    expect(focusedWindow(state)).toBe('a');
  });

  it('closes and resets', () => {
    const state = desktopReducer(open(EMPTY_DESKTOP, 'a'), { type: 'close', id: 'a' });
    expect(state.windows).toEqual([]);
    expect(desktopReducer(open(EMPTY_DESKTOP, 'a'), { type: 'reset' })).toEqual(EMPTY_DESKTOP);
  });

  it('cascades new windows', () => {
    expect(cascadePosition(2)).toEqual({ x: 244, y: 84 });
  });

  it('keeps 48px of a dragged window inside the desktop', () => {
    const size = { width: 400, height: 300 };
    const bounds = { width: 1000, height: 700 };
    expect(clampPosition({ x: 100, y: 100 }, size, bounds)).toEqual({ x: 100, y: 100 });
    expect(clampPosition({ x: -900, y: -50 }, size, bounds)).toEqual({ x: -352, y: 0 });
    expect(clampPosition({ x: 5000, y: 5000 }, size, bounds)).toEqual({ x: 952, y: 652 });
  });
});
