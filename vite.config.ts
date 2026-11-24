import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Load .env so the deployment base path can be changed without editing code.
  const env = loadEnv(mode, '.', '');

  return {
    // './' makes the build work from a domain root or a subdirectory.
    // Override with VITE_BASE_PATH=/campustask/ when hosted in a subfolder.
    base: env.VITE_BASE_PATH || './',
    plugins: [tailwindcss()],
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  };
});
