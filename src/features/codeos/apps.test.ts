import { describe, expect, it } from 'vitest';
import { APPS, appById } from './apps.ts';
describe('CodeOS applications', () => {
  it('opens the shared arcade inside CodeOS and retains the portfolio and code explorer', () => {
    expect(appById('games')?.url).toBe('/games.html?embed=codeos');
    expect(appById('games')?.kind).toBe('embed');
    expect(appById('projects')?.kind).toBe('projects');
    expect(appById('explorer')?.kind).toBe('explorer');
    expect(new Set(APPS.map((app) => app.id)).size).toBe(APPS.length);
  });
});
