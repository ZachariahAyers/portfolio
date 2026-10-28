/** This repository's own source, loaded as text only when the Code tab opens it. */
const files = import.meta.glob<string>(
  [
    '/src/features/codeos/**/*.{ts,tsx}',
    '/src/app/router.tsx',
    '/src/content/company.ts',
    '/content/company-projects.json',
    '!/src/**/*.test.{ts,tsx}',
  ],
  { query: '?raw', import: 'default' },
);

export const sourcePaths: string[] = Object.keys(files).map((key) => key.slice(1));

export interface SourceFile {
  name: string;
  tech: string;
  code: string;
}

const TECH: Record<string, string> = {
  tsx: 'React and TypeScript',
  ts: 'TypeScript',
  css: 'CSS',
  json: 'JSON',
};

/** Loads the listed files (paths from the repository root), grouped by folder. */
export async function loadSource(paths: readonly string[]): Promise<Record<string, SourceFile[]>> {
  const loaded = await Promise.all(
    paths.map(async (path) => {
      const load = files[`/${path}`];
      return load ? { path, code: await load() } : null;
    }),
  );
  const grouped: Record<string, SourceFile[]> = {};
  for (const file of loaded) {
    if (!file) continue;
    const slash = file.path.lastIndexOf('/');
    const name = file.path.slice(slash + 1);
    const tech = TECH[name.split('.').pop() ?? ''] ?? 'Text';
    (grouped[file.path.slice(0, slash)] ??= []).push({ name, tech, code: file.code });
  }
  return grouped;
}
