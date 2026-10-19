/** Resolves a file in public/ against the build's base path, so the site works from any folder. */
export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
