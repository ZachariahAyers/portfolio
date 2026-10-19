export interface OpenFile {
  path: string;
  folder: string;
  name: string;
  tech: string;
  code: string;
  docUrl?: string | undefined;
}

/** The tabs left after closing one, and which tab becomes active. */
export function closeTab(tabs: OpenFile[], active: string | null, path: string) {
  const remaining = tabs.filter((tab) => tab.path !== path);
  const nextActive = active === path ? (remaining.at(-1)?.path ?? null) : active;
  return { tabs: remaining, active: nextActive };
}
