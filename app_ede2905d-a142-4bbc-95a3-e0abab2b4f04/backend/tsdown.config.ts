import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/app.ts'],
  outDir: 'dist',
  format: ['esm'],
  dts: false,
  clean: true,
  sourcemap: false,
  minify: false,
  treeshake: true,
  target: 'es2022',
});
