import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dns from 'dns';
import path from 'path';

// Maintain localhost name instead of resolving to 127.0.0.1
dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'client'), // Set the root directory to client
  publicDir: path.resolve(__dirname, 'client/public'),
  server: {
    port: 3000, // Use a different port than the backend
    strictPort: true, // Fail if port is in use
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:4000',
        ws: true,
        changeOrigin: true,
      },
    },
    host: '0.0.0.0', // Listen on all addresses
    cors: true, // Enable CORS
  },
  preview: {
    port: 4173,
    host: '0.0.0.0', // Listen on all addresses for preview too
  },
  build: {
    outDir: '../dist/public', // Output to dist/public relative to client directory
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
});
