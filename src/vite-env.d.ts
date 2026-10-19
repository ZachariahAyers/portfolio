/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional PageSpeed Insights key for the Release tab. */
  readonly VITE_PAGESPEED_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
