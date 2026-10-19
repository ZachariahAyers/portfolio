import type { CSSProperties as ReactCSSProperties } from 'react';

declare module 'react' {
  /** Allows CSS custom properties, used for values computed while dragging. */
  interface CSSProperties extends Record<`--${string}`, string | number | undefined> {}
}

export type { ReactCSSProperties };
