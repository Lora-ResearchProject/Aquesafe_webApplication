import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [react()],
    define: {
      'import.meta.env.MODE': JSON.stringify(mode),
    },
    build: {
      sourcemap: isDev,        // Enable sourcemaps in dev only
      outDir: 'dist',          // Output folder
      assetsDir: 'assets',     // Asset subfolder
    },
    server: isDev
      ? {
          host: true,          // Allow external access
          port: 9000,          // Dev server port
          strictPort: true,    // Fail if port is in use
          hmr: {
            host: 'localhost',
            port: 9000,
          },
          open: true,          // Open browser on start
        }
      : {
          hmr: false,          // Disable HMR in production
        },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
    },
  };
});