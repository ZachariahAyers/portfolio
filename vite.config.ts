import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { devApi } from './server/dev-plugin.ts';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), devApi()],
  build: {
    // The Lambda bundle needs no static files.
    copyPublicDir: isSsrBuild !== true,
  },
  ssr: {
    // The Lambda bundle ships as one file with no node_modules beside it.
    noExternal: true,
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          include: ['{shared,server,src}/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'dom',
          environment: 'jsdom',
          include: ['src/**/*.test.tsx'],
          setupFiles: ['./src/test/setup.ts'],
        },
      },
    ],
  },
}));
