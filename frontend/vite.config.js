import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://127.0.0.1:3100', '/health': 'http://127.0.0.1:3100' }
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: { reporter: ['text', 'html'], include: ['src/components/**/*.jsx'] }
  }
});
