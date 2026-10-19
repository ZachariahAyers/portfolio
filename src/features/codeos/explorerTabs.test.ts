import { describe, expect, it } from 'vitest';
import { closeTab, type OpenFile } from './explorerTabs.ts';

const file = (path: string): OpenFile => ({ path, folder: 'f', name: path, tech: 't', code: '' });
const tabs = [file('a'), file('b'), file('c')];

describe('closeTab', () => {
  it('activates the last remaining tab when the active one closes', () => {
    expect(closeTab(tabs, 'c', 'c')).toEqual({ tabs: [file('a'), file('b')], active: 'b' });
  });

  it('keeps the active tab when another closes', () => {
    expect(closeTab(tabs, 'a', 'b')).toEqual({ tabs: [file('a'), file('c')], active: 'a' });
  });

  it('leaves nothing active after the last tab closes', () => {
    expect(closeTab([file('a')], 'a', 'a')).toEqual({ tabs: [], active: null });
  });
});
