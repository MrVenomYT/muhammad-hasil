import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  envPrefix: ['VITE_', 'FIREBASE_', 'EMAILJS_'],
  build: {
    target: 'esnext',
    cssMinify: 'esbuild',
    minify: 'esbuild',
    assetsInlineLimit: 4096,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        projects: resolve(__dirname, 'projects.html'),
        services: resolve(__dirname, 'services.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@emailjs')) {
            return 'emailjs-vendor';
          }
        },
      },
    },
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
});
