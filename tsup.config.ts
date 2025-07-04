import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: false,
  clean: true,
  minify: false,
  external: ['react', 'react-dom'],
  // Include CSS files
  loader: {
    '.css': 'copy',
  },
  // Copy CSS files to dist
  onSuccess: 'cp src/styles/*.css dist/ 2>/dev/null || true',
}) 