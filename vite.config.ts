import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './src/demo',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    hmr: {
      port: 3001,
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}) 