import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/app.ts'],
  outDir: 'dist',
  format: ['esm'],
  dts: false,
  clean: true,
  sourcemap: false,
  minify: false,
  treeshake: false,
  target: 'es2022',
  platform: 'node',
  shims: false,
});
