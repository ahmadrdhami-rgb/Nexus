import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'], // Exclude lucide-react from dependency optimization
  },
  define: {
    'process.env.NODE_ENV': '"development"', // Optional: Matches Node.js env
    global: 'window', // Polyfill global as window for browser compatibility with simple-peer
  },
});